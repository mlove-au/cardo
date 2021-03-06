import React, { FunctionComponent, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import API from "@aws-amplify/api";
import * as mutations from "@cardo/backend/src/graphql/mutations";
import { NavStackParamList } from "../../types";
import Page from "../../components/Page";
import Button from "../../components/Button";
import { ReportReason } from "@cardo/backend/src/API";
import { RouteProp } from "@react-navigation/native";
const splash = require("./images/splash.png");

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
    alignItems: "stretch",
  },
  centerContent: {
    alignContent: "stretch",
  },
  image: {
    marginLeft: "auto",
    marginRight: "auto",
  },
  subHeader: {
    fontSize: 20,
    fontFamily: "sans-serif-light",
    color: "#5A5A5A",
    textAlign: "center",
    marginTop: 30,
    marginLeft: 45,
    marginRight: 45,
  },
  button: {
    marginBottom: 20,
  },
});

type Props = {
  route: RouteProp<NavStackParamList, "reportmessage">;
  navigation: StackNavigationProp<NavStackParamList, "reportmessage">;
};

const ReportMessagePage: FunctionComponent<Props> = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitReport = async (reason: ReportReason) => {
    try {
      setIsLoading(true);
      await API.graphql({
        query: mutations.createReport,
        variables: {
          input: {
            reportMessageId: route.params.messageId,
            reason,
          },
        },
      });
      navigation.navigate("splash", {
        title: "Report a Message",
        header: "Thanks!",
        subHeader:
          "Your feedback is important in helping us keep the community safe.",
      });
    } catch (error) {
      navigation.navigate("error");
    }
    setIsLoading(false);
  };

  return (
    <Page centered style={styles.container}>
      <View style={styles.centerContent}>
        <Image style={styles.image} source={splash} />
        <Text style={styles.subHeader}>
          Why are you reporting this message?
        </Text>
      </View>
      <View style={styles.centerContent}>
        <Button
          disabled={isLoading}
          style={styles.button}
          onPress={() => onSubmitReport(ReportReason.SPAM)}
        >
          It's spam
        </Button>
        <Button
          disabled={isLoading}
          style={styles.button}
          onPress={() => onSubmitReport(ReportReason.INAPPROPRIATE)}
        >
          It's inappropriate
        </Button>
        <Button
          disabled={isLoading}
          onPress={() => onSubmitReport(ReportReason.OTHER)}
        >
          Other
        </Button>
      </View>
    </Page>
  );
};

export default ReportMessagePage;
