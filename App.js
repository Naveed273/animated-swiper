import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Card, Button } from "react-native-elements";
import Deck from "./src/Deck";
import Ball from "./src/Ball";

const DATA = [
  {
    id: 1,
    text: "Card #1",
    uri: "https://images.template.net/wp-content/uploads/2016/04/27043339/Nature-Wallpaper1.jpg",
  },
  {
    id: 2,
    text: "Card #2",
    uri: "https://i.pinimg.com/originals/70/6c/6a/706c6aa297207e719f0c39cacbc61d09.png",
  },
  {
    id: 3,
    text: "Card #3",
    uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Nature_celebrating_India.png/800px-Nature_celebrating_India.png",
  },
  {
    id: 4,
    text: "Card #4",
    uri: "https://i.pinimg.com/564x/f1/17/a4/f117a4bfe2db2c3b8c529e0b8e169d65.jpg",
  },
  {
    id: 5,
    text: "Card #5",
    uri: "https://images.template.net/wp-content/uploads/2016/04/27043339/Nature-Wallpaper1.jpg",
  },
  {
    id: 6,
    text: "Card #6",
    uri: "https://i.pinimg.com/564x/1e/af/92/1eaf92ec3476b22ac54759d895b91a7d.jpg",
  },
  {
    id: 7,
    text: "Card #7",
    uri: "https://i.pinimg.com/564x/58/7b/16/587b160bef1035bc29c61b0c85cf851c.jpg",
  },
  {
    id: 8,
    text: "Card #8",
    uri: "https://i.pinimg.com/750x/72/05/f1/7205f1adfbea57022929be69e109141f.jpg",
  },
];

class App extends React.Component {
  renderCard(item) {
    return (
      <Card key={item.id}>
        <Card.Title>{item.text}</Card.Title>
        <Card.Image
          source={{ uri: item.uri }}
          //resizeMode='cen'
        />
        <Text style={{ marginBottom: 10 }}>
          I can customize the Card further.
        </Text>
        <Button
          icon={{ name: "code" }}
          backgroundColor="#03A9F4"
          title="View Now!"
        />
      </Card>
    );
  }
  //this function will be called when all the cards are swiped out.
  renderNoMoreCards() {
    return (
      <Card>
        <Card.Title>All Done!</Card.Title>
        <Text style={{ marginBottom: 10 }}>There's no more content here!</Text>
        <Button backgroundColor="#03A9F4" title="Thank you!" />
      </Card>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/* <Ball />*/}

        <Deck
          data={DATA}
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
});
export default App;
