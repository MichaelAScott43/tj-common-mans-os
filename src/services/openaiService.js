export async function sendToOpenAI({ character, message }) {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        character,
        message
      })
    });

    const data = await response.json();

    return data.response;
  } catch (error) {
    console.error('OpenAI service error:', error);

    return 'Something went sideways for a minute. Try again in a second.';
  }
}
