import React, { useState, useEffect, useMemo } from 'react';
import {
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../styles/MyStyles';
import Apis, { authApis, endpoints } from "../../utils/Apis";
import { useNavigation } from "@react-navigation/native";
import { MyDispatchContext, MyUserContext } from "../../utils/MyContexts";
import { useContext } from "react";
import { RadioButton, Button, ActivityIndicator, Card, HelperText, List, TextInput, Modal, PaperProvider } from 'react-native-paper';
import { LineChart, PieChart, BarChart } from 'react-native-gifted-charts';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

const AdminDashboard = () => {
  const nav = useNavigation();
  const user = useContext(MyUserContext);
  const [stats, setStats] = useState({});
  const [selected, setSelected] = useState('month');
  const [loading, setLoading] = useState(false);

  const [percentcompleted, setPC] = useState([]);
  const [percentcompletedQ, setPCQ] = useState([]);
  const [percentcompletedY, setPCY] = useState([]);

  const [vaccineusage, setVU] = useState([]);
  const [vaccineusageByQuarter, setVUQ] = useState([]);
  const [vaccineusageByYear, setVUY] = useState([]);

  const [peoplecCompletedM, setPPCM] = useState([]);
  const [peoplecCompletedQ, setPPCQ] = useState([]);
  const [peoplecCompletedY, setPPCY] = useState([]);

  const filters = ['month', 'quarter', 'year'];
  const [selectedStat, setSelectedStat] = useState('completion_rate');

  const onChange = (value) => setSelected(value);

  const loadVU = async () => {
    try {
      setLoading(true);
      let url = endpoints['vaccineusage'];
      const response = await Apis.get(url);
      const responseQ = await Apis.get(`${url}?period=quarter`);
      const responseY = await Apis.get(`${url}?period=year`);

      if (response.data?.results) {
        setVU(response.data.results);
        setVUQ(responseQ.data.results);
        setVUY(responseY.data.results);
      }
      else {
        setVU(response.data);
        setVUQ(responseQ.data);
        setVUY(responseY.data);
      }
    } catch (error) {
      console.error('Error loading vaccineusage:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPPC = async () => {
    try {
      setLoading(true);
      let url = endpoints['people-completed'];
      const response = await Apis.get(`${url}?period=month`);
      const responseQ = await Apis.get(`${url}?period=quarter`);
      const responseY = await Apis.get(`${url}?period=year`);

      if (response.data?.results) {
        setPPCM(response.data.results);
        setPPCQ(responseQ.data.results);
        setPPCY(responseY.data.results);
      }
      else {
        setPPCM(response.data);
        setPPCQ(responseQ.data);
        setPPCY(responseY.data);
      }
    } catch (error) {
      console.error('Error loading people completed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCompletedRate = async () => {
    try {
      setLoading(true);
      let url = endpoints['appointment'];
      const response = await Apis.get(`${url}completion-rate`);
      const responseQ = await Apis.get(`${url}completion-rate?period=quarter`);
      const responseY = await Apis.get(`${url}completion-rate?period=year`);
      const data = response.data;

      if (data?.results) {
        setPC(data.results);
        setPCQ(responseQ.data.results);
        setPCY(responseY.data.results);
      }
      else {
        setPC(data);
        setPCQ(responseQ.data);
        setPCY(responseY.data);
      }

    } catch (error) {
      console.error('Error loading completed rate:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVU();
    loadCompletedRate();
    loadPPC();
  }, []);

  const renderVU = ({ item: i, index }) => (
    <View key={i.id ? `${i.id}-${index}` : `key-${index}`} style={commonStyles.card}>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Vaccine type: </Text>
        <Text style={[styles.textValue]}>{i.category_name}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Period: </Text>
        <Text style={[styles.textValue]}>{i.period}</Text>
      </Text>
      <Text style={{ marginBottom: SPACING.small }}>
        <Text style={[styles.textName]}>Dose Used: </Text>
        <Text style={[styles.textValue]}>{i.dose_quantity_used}</Text>
      </Text>
    </View>
  );
  const getFilteredData = () => {
    if (selected === 'month') return vaccineusage;
    if (selected === 'quarter') return vaccineusageByQuarter;
    if (selected === 'year') return vaccineusageByYear;
    return [];
  };
  const getFilteredPC = () => {
    if (selected === 'month') return percentcompleted;
    if (selected === 'quarter') return percentcompletedQ;
    if (selected === 'year') return percentcompletedY;
    return [];
  };
  const getPPC = () => {
    if (selected === 'month') return peoplecCompletedM;
    if (selected === 'quarter') return peoplecCompletedQ;
    if (selected === 'year') return peoplecCompletedY;
    return [];
  };
  const CompletionInfo = ({ data }) => {
    if (!data || !Array.isArray(data)) {
      return <Text>no data</Text>;
    }
    const getPeriodLabel = (period) => {
      if (!period) return '';
      const year = period.slice(0, 4);
      const month = parseInt(period.slice(5, 7), 10);

      if (selected === 'year') return year;
      if (selected === 'month') return `${year}-${period.slice(5, 7)}`;
      if (selected === 'quarter') {
        const quarter = Math.floor((month - 1) / 3) + 1;
        return `${year} Q${quarter}`;
      }
      return '';
    };
    const grouped = data.reduce((acc, item) => {
      const label = getPeriodLabel(item.period);
      if (!acc[label]) acc[label] = [];
      acc[label].push(item);
      return acc;
    }, {});

    const summary = Object.entries(grouped).map(([label, items]) => {
      const totalAppointments = items.reduce((sum, i) => sum + i.total_appointments, 0);
      const totalCom = items.reduce((sum, i) => sum + i.total_completed, 0);
      return { label, totalAppointments, totalCom };
    });

    return (
      <View>
        {summary.map(({ label, totalAppointments, totalCom }) => (
          <View key={label}>
            <Text style={styles.labelTitle}>{label}:</Text>
            <Text style={styles.subTitle}>Total Appointments: {totalAppointments}</Text>
            <Text style={styles.subTitle}>Completed: {totalCom}</Text>
            <Text style={styles.subTitle}>Percent Completed: {(totalCom / totalAppointments * 100).toFixed(1)}%</Text>
          </View>
        ))}
      </View>
    );
  };
  const COLORS_LIST = ['#4CAF50', '#F44336', '#2196F3', '#FF9800', '#9C27B0'];

  const chartDataSet = useMemo(() => {
    const dt = getFilteredData();

    let labelsSet = new Set();
    dt.forEach(item => {
      if (!item.category_name || !item.period || typeof item.dose_quantity_used !== 'number') return;

      let label = '';
      if (selected === 'month' || selected === 'quarter') {
        label = item.period.slice(0, 7);
      } else if (selected === 'year') {
        label = item.period.slice(0, 4);
      }
      labelsSet.add(label);
    });
    const labels = Array.from(labelsSet).sort();
    const grouped = {};

    dt.forEach(item => {
      if (!item.category_name || !item.period || typeof item.dose_quantity_used !== 'number') return;

      let label = '';
      if (selected === 'month' || selected === 'quarter') {
        label = item.period.slice(0, 7);
      } else if (selected === 'year') {
        label = item.period.slice(0, 4);
      }

      if (!grouped[item.category_name]) grouped[item.category_name] = {};
      grouped[item.category_name][label] = item.dose_quantity_used;
    });

    return Object.entries(grouped).map(([category_name, data], index) => ({
      label: category_name,
      color: COLORS_LIST[index % COLORS_LIST.length],
      data: labels.map(label => ({
        label,
        value: data[label] ?? 0,
        dataPointText: String(data[label] ?? 0),
      })),
    }));
  }, [selected, vaccineusage, vaccineusageByQuarter, vaccineusageByYear]);

  const pcdata = useMemo(() => {
    const dt = getFilteredPC();

    if (!dt || dt.length === 0) return [];
    const getLabel = (period) => {
      if (!period) return '';
      if (selected === 'month' || selected === 'quarter') return period.slice(0, 7);
      if (selected === 'year') return period.slice(0, 4);
      return '';
    };

    const labelsSet = new Set(dt.map(item => getLabel(item.period)));
    const labels = Array.from(labelsSet).sort();
    const completionData = labels.map(label => {
      const item = dt.find(i => getLabel(i.period) === label);
      const percent = item && typeof item.completion_rate_percent === 'number' ? item.completion_rate_percent : 0;
      return {
        label,
        value: percent,
        dataPointText: `${percent}%`,
        frontColor: '#4CAF50',
      };
    });
    return [
      {
        data: completionData,
      }
    ];
  }, [selected, percentcompleted, percentcompletedQ, percentcompletedY]);

  const ppcdata = useMemo(() => {
    const dt = getPPC();

    const data = dt.map(item => {
      let label = '';
      if (selected === 'month' || selected === 'quarter') {
        label = item.period.slice(0, 7); // YYYY-MM
      } else if (selected === 'year') {
        label = item.period.slice(0, 4); // YYYY
      }

      return {
        label,
        value: item.people_completed_count ?? 0,
        dataPointText: String(item.people_completed_count ?? 0),
      };
    });
    return [
      {
        label: 'People Vaccinated',
        color: '#4CAF50',
        data: data.sort((a, b) => a.label.localeCompare(b.label)), // Sắp xếp theo thời gian
      }
    ];
  }, [selected, vaccineusage, vaccineusageByQuarter, vaccineusageByYear]);

  // console.info(pcdata[0]);
  // console.info(chartDataSet[0]);
  // console.info(getFilteredPC());
  // console.info(percentcompletedY);
  // console.info(getPPC());
  // console.info(ppcdata);

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <TouchableOpacity
          style={commonStyles.backButton}
          onPress={() => nav.goBack()}
        >
          <Text style={commonStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Admin Statistics</Text>
        <View style={styles.emptySpace} />
      </View>
      <ScrollView>
        <View style={styles.m8}>
          <SegmentedControl
            values={["People Completed", "Completion Rate", "Vaccine Usage"]}
            selectedIndex={1}
            onChange={(event) => {
              const index = event.nativeEvent.selectedSegmentIndex;
              setSelectedStat(index === 0 ? "people_vaccinated" : index === 1 ? "completion_rate" : "vaccine_usage");
            }}
          />
        </View>
        <View style={[styles.flexRow, styles.center, { marginTop: 5, marginBottom: 5 }]}>
          {filters.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => onChange(item)}
              style={[{
                padding: 10,
                margin: 5,
                backgroundColor: selected === item ? '#007aff' : '#e0e0e0',
              }]}
            >
              <Text style={[{ color: selected === item ? '#fff' : '#333' }]}>
                {item.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedStat === 'completion_rate' && (
          <Card style={[styles.card]}>
            <View style={[styles.center]}>
              <Text style={[styles.title, styles.textCenter]}>Completion Rate Percent by {selected}</Text>
              <View >
                {pcdata.length > 0 ?
                  <BarChart
                    key={selected}
                    data={pcdata[0].data}
                    width={280}
                    height={210}
                    spacing={40}
                    initialSpacing={20}
                    noOfSections={4}
                    textShiftY={-10}
                    maxValue={100}
                    yAxisLabelSuffix="%"
                    showValuesAsTopLabel
                  /> : <Text>No data</Text>}
              </View>
            </View>

            <ScrollView>
              {selected === "month" ? <CompletionInfo data={percentcompleted} selected={selected} /> :
                selected === "quarter" ? <CompletionInfo data={percentcompletedQ} selected={selected} /> :
                  <CompletionInfo data={percentcompletedY} selected={selected} />}
            </ScrollView>
          </Card>
        )}

        {selectedStat === 'vaccine_usage' && (
          <Card style={[styles.card]}>
            <Text style={[styles.title, styles.textCenter]}>
              Vaccine Type Usage by {selected}
            </Text>
            <View>
              <View>
                {chartDataSet.length > 0 ? <LineChart
                  key={selected}
                  dataSet={chartDataSet}
                  height={200}
                  spacing={70}
                  width={280}
                  showLineDots={true}
                  showValuesAsDataPointsText={true}
                  textShiftY={-10}
                  dataPointRadius={6}
                  noOfSections={5}
                /> : <Text>No data</Text>}
              </View>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
              {chartDataSet.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', margin: 4 }}>
                  <View style={{
                    width: 12,
                    height: 12,
                    backgroundColor: item.color,
                    marginRight: 6,
                    borderRadius: 6,
                  }} />
                  <Text style={{ fontSize: 12 }}>{item.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}
        {selectedStat === 'people_vaccinated' && (
          <Card style={[styles.card]}>
            <Text style={[styles.title, styles.textCenter]}>
              People Completed by {selected}
            </Text>
            <View>
              {ppcdata.length > 0 ? <LineChart
                key={selected}
                data={ppcdata[0].data}
                height={200}
                spacing={70}
                width={280}
                showLineDots={true}
                showValuesAsDataPointsText={true}
                textShiftY={-10}
                noOfSections={5}
              /> : <Text>No data</Text>}
            </View>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.medium,
    backgroundColor: COLORS.background.primary,
  },
  title: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.medium,
  },
  flexRow: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: 'space-evenly',
  },
  textCenter: {
    alignSelf: 'center',
  },
  subTitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.black,
  },
  card: {
    padding: 8,
    margin: 8,
  },
  labelTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  m8: {
    margin: 8,
  },
});

export default AdminDashboard;