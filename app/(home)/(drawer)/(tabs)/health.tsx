import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { useSahha } from "~/providers/SahhaProvider";
import StepsCard from "~/components/health/StepsCard";
import SleepCard from "~/components/health/SleepCard";
import { SahhaBiomarkerType } from "sahha-react-native";
import { CalendarProvider, WeekCalendar } from "react-native-calendars";

interface Props {
  weekView?: boolean;
}

const health = () => {
  const [weekView, setWeekView] = useState<boolean>(true);

  const [steps, setSteps] = useState<number>(0);
  const [sleep, setSleep] = useState<number>(0);
  const [heartRate, setHeartRate] = useState<number>(0);
  const { isAuthenticated, sensorStatus, getBiomarkers } = useSahha();

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const steps = await getBiomarkers(
          SahhaBiomarkerType.steps,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          new Date(Date.now())
        );

        setSteps(steps);
      } catch (error) {
        console.error("Error fetching steps:", error);
      }
    };

    fetchSteps();
  }, []);

  return (
    <View className="flex-1 flex flex-col items-start justify-start">
      <CalendarProvider
        date={new Date().toISOString()}
        style={{ maxHeight: 68 }}
      >
        <WeekCalendar
          maxDate={new Date().toISOString()}
          disableAllTouchEventsForDisabledDays
          theme={{
            backgroundColor: "transparent",
            calendarBackground: "transparent",
            textDayStyle: {
              color: "white",
            },
          }}
        />
      </CalendarProvider>
      <View className="flex-1 items-start justify-start flex h-full gap-4 w-full p-4">
        {isAuthenticated && sensorStatus === 3 ? (
          <>
            <StepsCard steps={steps} />
            <SleepCard steps={sleep} />
          </>
        ) : (
          <Text>Not authenticated</Text>
        )}
      </View>
    </View>
  );
};

export default health;
