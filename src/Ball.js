import React, { Component } from 'react';
import { View, Animated } from 'react-native';

class Ball extends Component {
	componentWillMount() {
		//it answeres the question i-e what is the current position of the item.
		this.position = new Animated.ValueXY(0, 0);
		//spring is used to change the current position.It takes two arguments,current position and next/new position.
		Animated.spring(this.position, {
			//it answers the question what is the element moving to?.
			toValue: { x: 200, y: 500 },
		}).start();
	}

	render() {
		return (
			//it answers the question which element we are attempting to move?
			/*Animated.View is different from View and other components like Text,image etc can also be nested within this component.
			it takes the position.getLayout() has some information that tells Animated.View how to do changes.
			style={this.position.getLayout()} is used to setup the position of the View element.
			*/
			<Animated.View  style={this.position.getLayout()}>
				<View style={styles.ball} />
			</Animated.View>
		);
	}
}

const styles = {
	ball: {
		height: 60,
		width: 60,
		borderRadius: 30,
		borderWidth: 30,
		borderColor: 'black',
	},
};

export default Ball;
