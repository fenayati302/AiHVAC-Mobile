import { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";

const { width } = Dimensions.get("window");

export default function ReportsScreen({ navigation }) {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("today");
  const [reportData, setReportData] = useState(null);

  const timeRanges = [
    { label: "Today", value: "today" },
    { label: "Week", value: "week" },
    { label: "Month", value: "month" },
  ];

  useEffect(() => {
    loadReportData();
  }, [timeRange]);

  const loadReportData = async () => {
    // TODO: Implement API call to get historical data
    // For now, using sample data
    setReportData({
      avgTemp: 76.5,
      maxTemp: 78.2,
      minTemp: 74.8,
      avgCurrent: 12.3,
      uptime: 98.5,
      incidents: 2,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports & History</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {timeRanges.map((range) => (
            <TouchableOpacity
              key={range.value}
              style={[
                styles.timeRangeButton,
                timeRange === range.value && styles.timeRangeButtonActive,
              ]}
              onPress={() => setTimeRange(range.value)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range.value && styles.timeRangeTextActive,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Statistics Cards */}
        {reportData && (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>🌡️</Text>
                <Text style={styles.statLabel}>Avg Temp</Text>
                <Text style={styles.statValue}>{reportData.avgTemp}°F</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⚡</Text>
                <Text style={styles.statLabel}>Avg Current</Text>
                <Text style={styles.statValue}>{reportData.avgCurrent}A</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📈</Text>
                <Text style={styles.statLabel}>Max Temp</Text>
                <Text style={styles.statValue}>{reportData.maxTemp}°F</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>📉</Text>
                <Text style={styles.statLabel}>Min Temp</Text>
                <Text style={styles.statValue}>{reportData.minTemp}°F</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⏱️</Text>
                <Text style={styles.statLabel}>Uptime</Text>
                <Text style={styles.statValue}>{reportData.uptime}%</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statIcon}>⚠️</Text>
                <Text style={styles.statLabel}>Incidents</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: reportData.incidents > 0 ? "#eab308" : "#22c55e" },
                  ]}
                >
                  {reportData.incidents}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Recent Events */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Events</Text>

          <View style={styles.eventItem}>
            <View style={styles.eventDot} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>System Normal Operation</Text>
              <Text style={styles.eventTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.eventItem}>
            <View style={[styles.eventDot, { backgroundColor: "#eab308" }]} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Temperature Spike Detected</Text>
              <Text style={styles.eventTime}>Yesterday, 3:45 PM</Text>
            </View>
          </View>

          <View style={styles.eventItem}>
            <View style={styles.eventDot} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>Compressor Cycle Completed</Text>
              <Text style={styles.eventTime}>Yesterday, 2:30 PM</Text>
            </View>
          </View>
        </View>

        {/* Export Options */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Export Report</Text>

          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportIcon}>📄</Text>
            <Text style={styles.exportText}>Download PDF Report</Text>
            <Text style={styles.exportArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.exportButton}>
            <Text style={styles.exportIcon}>📊</Text>
            <Text style={styles.exportText}>Download CSV Data</Text>
            <Text style={styles.exportArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1e293b",
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 28,
    color: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  timeRangeContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  timeRangeButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#94a3b8",
  },
  timeRangeTextActive: {
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  card: {
    backgroundColor: "#1e293b",
    margin: 16,
    marginTop: 4,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eventDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22c55e",
    marginTop: 4,
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    color: "#cbd5e1",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    color: "#64748b",
  },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  exportIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  exportText: {
    flex: 1,
    fontSize: 16,
    color: "#cbd5e1",
  },
  exportArrow: {
    fontSize: 20,
    color: "#64748b",
  },
});
