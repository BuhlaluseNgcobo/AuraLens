
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ModelName, Sentiment } from '../types';

// Use the API key from environment variables, which is the standard for this app.
const GEMINI_API_KEY = process.env.API_KEY;

// Initialize the client. The SDK will handle errors if a call is made without a valid key.
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || '' });


const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: "The sentiment of the text. Must be 'positive', 'negative', or 'neutral'.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "A confidence score between 0.0 and 1.0.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of up to 3 most relevant keywords from the text.",
    },
    explanation: {
      type: Type.STRING,
      description: "A brief, one-sentence explanation for the sentiment prediction.",
    },
  },
  required: ["sentiment", "confidence", "keywords", "explanation"],
};

export const analyzeText = async (text: string, model: ModelName): Promise<AnalysisResult> => {
    if (!GEMINI_API_KEY) {
        // This is a safeguard; the UI should prevent this call from happening.
        return {
            text,
            sentiment: Sentiment.Error,
            confidence: 0,
            keywords: [],
            explanation: `Gemini API key is not configured. Analysis disabled.`,
        };
    }
    
    if (!text || !text.trim()) {
        return {
            text: text,
            sentiment: Sentiment.Neutral,
            confidence: 0.0,
            keywords: [],
            explanation: 'Empty input',
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Analyze the sentiment of the following text. Classify it as 'positive', 'negative', or 'neutral'. Provide a confidence score, extract key words, and give a brief explanation.\n\nText: "${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
            },
        });
        
        const resultJson = JSON.parse(response.text);
        
        return {
            text,
            sentiment: resultJson.sentiment.toLowerCase(),
            confidence: resultJson.confidence,
            keywords: resultJson.keywords,
            explanation: resultJson.explanation,
        };
    } catch (error) {
        console.error("Error analyzing text with Gemini:", error);
         return {
            text,
            sentiment: Sentiment.Error,
            confidence: 0,
            keywords: [],
            explanation: `An error occurred during analysis with the Gemini API. See console for details.`,
         };
    }
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeBatch = async (
    texts: string[],
    model: ModelName,
    onProgress: (processed: number) => void
): Promise<AnalysisResult[]> => {
    const allResults: AnalysisResult[] = [];
    let processedCount = 0;

    // The free tier for the Gemini API has a rate limit (e.g., 10 requests per minute).
    // To avoid hitting this limit, we introduce a delay between consecutive API calls.
    // 60 seconds / 10 requests = 6 seconds per request. A small buffer is added.
    const REQUEST_DELAY_MS = 6100;

    for (const text of texts) {
        const result = await analyzeText(text, model);
        allResults.push(result);
        processedCount++;
        onProgress(processedCount);

        // To avoid hitting the rate limit, wait before sending the next request.
        // This pause is skipped after the very last item in the batch.
        if (processedCount < texts.length) {
            await sleep(REQUEST_DELAY_MS);
        }
    }
    return allResults;
};
