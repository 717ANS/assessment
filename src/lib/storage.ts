export interface SurveyResult {
  type: 'business' | 'globalization';
  answers: (number | number[])[][];
  score: number;
  maxScore: number;
  percentage: number;
  maturity: string;
  timestamp: number;
}

export const saveSurveyResult = (result: SurveyResult) => {
  try {
    const existingResults = getSurveyResults();
    const updatedResults = existingResults.filter(r => r.type !== result.type);
    updatedResults.push(result);
    localStorage.setItem('surveyResults', JSON.stringify(updatedResults));
    return true;
  } catch (error) {
    console.error('保存问卷结果失败:', error);
    return false;
  }
};

export const getSurveyResults = (): SurveyResult[] => {
  try {
    const results = localStorage.getItem('surveyResults');
    return results ? JSON.parse(results) : [];
  } catch (error) {
    console.error('获取问卷结果失败:', error);
    return [];
  }
};

export const getSurveyResultByType = (type: 'business' | 'globalization'): SurveyResult | null => {
  const results = getSurveyResults();
  return results.find(r => r.type === type) || null;
};

export const clearSurveyResults = () => {
  try {
    localStorage.removeItem('surveyResults');
    return true;
  } catch (error) {
    console.error('清除问卷结果失败:', error);
    return false;
  }
}; 