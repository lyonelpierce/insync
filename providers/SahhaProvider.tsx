import Sahha, {
  SahhaSensor,
  SahhaEnvironment,
  SahhaSensorStatus,
} from "sahha-react-native";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SahhaContextType {
  isAuthenticated: boolean;
  sensorStatus: SahhaSensorStatus | null;
  getAuthentication: () => void;
  getSensorStatus: () => void;
  enableSensors: () => void;
  authenticate: (userId: string) => void;
}

const SahhaContext = createContext<SahhaContextType | undefined>(undefined);

export function SahhaProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sensorStatus, setSensorStatus] = useState<SahhaSensorStatus | null>(
    null
  );

  useEffect(() => {
    console.log("Values updated:", {
      isAuthenticated,
      sensorStatus,
    });
  }, [isAuthenticated, sensorStatus]);

  useEffect(() => {
    // Use custom values
    const settings = {
      environment: SahhaEnvironment.sandbox, // Required -  .sandbox for testing
      // Optional - Android only
      notificationSettings: {
        icon: "ic_test",
        title: "Test Title",
        shortDescription: "Test description.",
      },
    };

    Sahha.configure(settings, (error: string, success: boolean) => {
      console.log(`Success: ${success}`);
      if (error) {
        console.error(`Error: ${error}`);
      } else {
        getAuthentication();
        getSensorStatus();
      }
    });
  }, []);

  const getAuthentication = () => {
    Sahha.isAuthenticated((error: string, success: boolean) => {
      if (error) {
        console.error(`Error: ${error}`);
      } else {
        setIsAuthenticated(success);
      }
    });
  };

  const getSensorStatus = () => {
    Sahha.getSensorStatus(
      [SahhaSensor.steps, SahhaSensor.sleep, SahhaSensor.heart_rate],
      (error: string, value: SahhaSensorStatus) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else {
          console.log(`Sensor Status: ${value}`);
          setSensorStatus(value);
        }
      }
    );
  };

  const enableSensors = () => {
    Sahha.enableSensors(
      [SahhaSensor.steps, SahhaSensor.sleep],
      (error: string, value: SahhaSensorStatus) => {
        if (error) {
          console.error(`Error: ${error}`);
        } else {
          console.log(`Sensor Status: ${value}`);
          setSensorStatus(value);

          if (value == SahhaSensorStatus.enabled) {
            // Sensors are enabled and ready
          } else {
            // Sensors are disabled or unavailable
          }
        }
      }
    );
  };

  const authenticate = (userId: string) => {
    Sahha.authenticate(
      process.env.EXPO_PUBLIC_SAHHA_APP_ID!, // Replace with your actual APP_ID
      process.env.EXPO_PUBLIC_SAHHA_APP_SECRET!, // Replace with your actual APP_SECRET
      userId,
      (error: string, success: boolean) => {
        if (error) {
          console.error(`Authentication Error: ${error}`);
        } else {
          console.log(`Authentication Success: ${success}`);
          setIsAuthenticated(success);
        }
      }
    );
  };

  return (
    <SahhaContext.Provider
      value={{
        isAuthenticated,
        sensorStatus,
        getAuthentication,
        getSensorStatus,
        enableSensors,
        authenticate,
      }}
    >
      {children}
    </SahhaContext.Provider>
  );
}

export function useSahha() {
  const context = useContext(SahhaContext);
  if (context === undefined) {
    throw new Error("useSahha must be used within a SahhaProvider");
  }
  return context;
}
