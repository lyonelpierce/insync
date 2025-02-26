import Sahha, {
  SahhaSensor,
  SahhaEnvironment,
  SahhaSensorStatus,
  SahhaBiomarkerType,
  SahhaBiomarkerCategory,
} from "sahha-react-native";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SahhaContextType {
  isAuthenticated: boolean;
  sensorStatus: SahhaSensorStatus | null;
  getAuthentication: () => void;
  getSensorStatus: () => void;
  enableSensors: () => void;
  authenticate: (userId: string) => void;
  getBiomarkers: (
    type: SahhaBiomarkerType,
    startDate?: Date,
    endDate?: Date
  ) => Promise<any>;
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
      [SahhaSensor.steps, SahhaSensor.sleep],
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
  const getBiomarkers = (
    type: SahhaBiomarkerType,
    startDate: Date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: Date = new Date()
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      Sahha.getBiomarkers(
        [
          SahhaBiomarkerCategory.activity,
          SahhaBiomarkerCategory.sleep,
          SahhaBiomarkerCategory.vitals,
        ],
        [type],
        startDate.getTime(),
        endDate.getTime(),
        (error: string, value: string) => {
          if (error) {
            console.error(`Error: ${error}`);
            reject(error);
          } else if (value) {
            const jsonArray = JSON.parse(value);
            resolve(jsonArray);
          }
        }
      );
    });
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
        getBiomarkers,
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
