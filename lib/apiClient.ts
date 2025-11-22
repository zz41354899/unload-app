import { GoogleGenerativeAI } from '@google/genai';

let apiClient: GoogleGenerativeAI | null = null;

export const initializeApiClient = (apiKey: string): GoogleGenerativeAI => {
  apiClient = new GoogleGenerativeAI(apiKey);
  return apiClient;
};

export const getApiClient = (): GoogleGenerativeAI | null => {
  return apiClient;
};

export const isApiClientInitialized = (): boolean => {
  return apiClient !== null;
};

export const testApiKey = async (apiKey: string): Promise<{ success: boolean; message: string }> => {
  try {
    const client = new GoogleGenerativeAI(apiKey);
    const model = client.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent('說一個字');
    
    if (result.response) {
      return {
        success: true,
        message: 'API Key 驗證成功'
      };
    }
    
    return {
      success: false,
      message: 'API Key 驗證失敗：無法取得回應'
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '未知錯誤';
    return {
      success: false,
      message: `API Key 驗證失敗：${errorMessage}`
    };
  }
};

export const generateTaskAnalysis = async (
  taskDescription: string,
  category: string,
  worry: string,
  owner: string,
  controlLevel: number
): Promise<string> => {
  if (!apiClient) {
    throw new Error('API 客戶端未初始化');
  }

  const model = apiClient.getGenerativeModel({ model: 'gemini-pro' });
  
  const prompt = `
請根據以下課題資訊提供分析和建議：

課題描述：${taskDescription}
課題分類：${category}
擔憂因素：${worry}
責任歸屬：${owner}
控制力程度：${controlLevel}%

請提供：
1. 課題分析（2-3句）
2. 建議行動（3-5點）
3. 心理建議（2-3句）
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
};
