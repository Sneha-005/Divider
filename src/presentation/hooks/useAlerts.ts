import { useState, useCallback } from 'react';
import { Alert } from '../../domain/entities/alert.entity';
import { AlertRepositoryImpl } from '../../data/repositories/alert.repository.impl';
import { AlertRemoteDataSource } from '../../data/datasources/remote/alert.remote.datasource';
import { AuthLocalDataSource } from '../../data/datasources/local/auth.local.datasource';
import { GetAlertsUseCase } from '../../domain/use-cases/get-alerts.usecase';
import { CreateAlertUseCase } from '../../domain/use-cases/create-alert.usecase';

const authLocalDataSource = new AuthLocalDataSource();
const remoteDataSource = new AlertRemoteDataSource(authLocalDataSource);
const repository = new AlertRepositoryImpl(remoteDataSource);
const getAlertsUseCase = new GetAlertsUseCase(repository);
const createAlertUseCase = new CreateAlertUseCase(repository);

interface UseAlertsReturn {
  alerts: Alert[];
  activeAlerts: Alert[];
  triggeredAlerts: Alert[];
  loading: boolean;
  creating: boolean;
  error: string | null;
  fetchAlerts: () => Promise<void>;
  createAlert: (symbol: string, price: number, condition: "ABOVE" | "BELOW") => Promise<void>;
}

export const useAlerts = (): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getAlertsUseCase.execute();
      console.log('✓ Alerts fetched:', data);
      console.log('✓ Active alerts count:', data?.filter((a: Alert) => a.isActive).length);
      console.log('✓ Triggered alerts count:', data?.filter((a: Alert) => !a.isActive).length);
      setAlerts(data && Array.isArray(data) ? data : []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load alerts';
      setError(errorMessage);
      console.error('✗ Fetch alerts error:', err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createNewAlert = useCallback(
    async (symbol: string, price: number, condition: "ABOVE" | "BELOW") => {
      try {
        setError(null);
        setCreating(true);
        const newAlert = await createAlertUseCase.execute(symbol, price, condition);
        setAlerts([newAlert, ...alerts]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create alert';
        setError(errorMessage);
        console.error('Create alert error:', err);
      } finally {
        setCreating(false);
      }
    },
    [alerts]
  );

  const activeAlerts = alerts.filter((alert) => alert.isActive);
  const triggeredAlerts = alerts.filter((alert) => !alert.isActive);

  return {
    alerts,
    activeAlerts,
    triggeredAlerts,
    loading,
    creating,
    error,
    fetchAlerts,
    createAlert: createNewAlert,
  };
};
