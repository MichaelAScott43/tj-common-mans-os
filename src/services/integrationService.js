export function toggleIntegration(integrations, id) {
  return integrations.map((integration) =>
    integration.id === id ? { ...integration, connected: !integration.connected } : integration
  );
}

export function connectionStatusLabel(integration) {
  if (integration.connected) {
    return integration.metadataOnly ? 'Connected (metadata only)' : 'Connected';
  }
  return 'Not connected';
}
