/**
 * Matches backend CEF schema (backend/app/schemas/event.py)
 */

export type EventType = 'agent' | 'model' | 'tool' | 'validation' | 'state' | 'error';
export type EventStatus = 'success' | 'failure' | 'warning' | 'skipped';

export interface TraceEvent {
  event_id: string;
  run_id: string;
  sequence: number;
  parent_event_id?: string | null;
  event_type: EventType;
  component: string;
  input: Record<string, any>;
  output: Record<string, any>;
  status: EventStatus;
  error_details?: Record<string, any> | string | null;
  duration_ms: number;
  timestamp: string;
  metadata?: {
    schema_version?: string;
    mocked?: boolean;
    is_intervened?: boolean;
    intervention_type?: string;
    [key: string]: any;
  };
}
