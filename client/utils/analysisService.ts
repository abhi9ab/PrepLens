export const analyzeFrame = async (frameData: ImageData): Promise<AnalysisResult> => {
    try {
      const response = await fetch('http://localhost:5000/api/analyze-frame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ frame: Array.from(frameData.data) }),
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Frame analysis error:', error);
      throw error;
    }
  };
  