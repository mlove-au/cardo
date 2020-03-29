import React, { FunctionComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Connect } from "aws-amplify-react-native";
import API, { graphqlOperation } from "@aws-amplify/api";
import { StackNavigationProp } from "@react-navigation/stack";
import * as queries from "@cardo/backend/src/graphql/queries";
import { ListCategorysQuery } from "@cardo/backend/src/API";
import CategoryCard from "../components/CategoryCard";

import amplifyConfig from "../../aws-exports.js";
API.configure(amplifyConfig);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

type Props = {
  navigation: StackNavigationProp<NavStackParamList, "home">;
};
const StartPage: FunctionComponent<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Connect query={graphqlOperation(queries.listCategorys)}>
        {({
          data: { listCategorys },
          loading,
          errors
        }: {
          data: ListCategorysQuery;
          loading: boolean;
          errors: Array<Error>;
        }) => {
          if (errors && errors.length)
            return <Text>d {JSON.stringify(errors)}</Text>;
          if (loading) return <Text>Loading...</Text>;

          if (listCategorys && listCategorys.items) {
            return listCategorys.items?.map(category => {
              return category ? (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  onPress={() =>
                    navigation.navigate("category", { id: category.id })
                  }
                />
              ) : null;
            });
          }
        }}
      </Connect>
    </View>
  );
};

export default StartPage;
