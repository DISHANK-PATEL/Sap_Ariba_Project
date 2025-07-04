/**
 * useFetchEventData Hook
 * Provides functionality to fetch event data from API
 */

export interface EventData {
  task: any;
  workspace: any;
  rfx: any;
}

export const useFetchEventData = () => {
  const fetchEventData = async (taskId: string): Promise<EventData> => {
    const response = await fetch(`/api/event/${taskId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event data');
    }
    return response.json();
  };

  return { fetchEventData };
};
