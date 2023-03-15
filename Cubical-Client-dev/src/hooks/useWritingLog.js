// Context
import { useMsal } from "../context/msalContext";

// Config
import { getAppInsights } from "../config/TelemetryService";

// logs
import { SeverityLevel } from "@microsoft/applicationinsights-web";

export function useWritingLog() {
  const { user } = useMsal();

  const customTrackException = (exception, props = null, severityLevel = SeverityLevel.Error) => {
    const properties = { ...props, user };
    const insights = getAppInsights();
    if (insights) {
        insights.trackException({
        exception,
        properties,
        severityLevel
      });
    }
  };

  const customTrackEvent = (name, props = null) => {
    const properties = { ...props, user };
    const insights = getAppInsights();
    if (insights) {
        insights.trackEvent({
        name,
        properties
      });
    }
  };

  return { customTrackException, customTrackEvent };
}
