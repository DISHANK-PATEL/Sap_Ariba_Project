/**
 * generateSummary Utility
 * Generates AI-powered summary of the provided data using backend API
 */
export const generateSummary = async (data: any): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: 'Please provide a comprehensive summary of this event data with key insights and recommendations.',
        data: data,
        messages: []
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary. Please try again.');
  }
};
