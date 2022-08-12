import React, { Component } from 'react';
import {
	View,
	StyleSheet,
	//PanResponder handles the user's input i-e(press on the screen,drags finger handled by gesture system)
	PanResponder,
	//react animation handles output of the user's input(i-e card moves handled by Animated system.)
	Animated,
	//Diamension obj is used to retrieve the height/width of th screen of the device that the app is running on currently.
	Dimensions,
	LayoutAnimation,
	UIManager,
	ScrollView,
} from 'react-native';
//It is the screen width.we declare it const because we aspect it to not change over time.
const SCREEN_WIDTH = Dimensions.get('window').width;
//0.25*SCREEN_WIDTH means  gesture moves 1/4 of the screen width.
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
	//set default value for the props'data to minimize the chance of error,when this data has not been passed yet.
	static defaultProps = {
		onSwipeRight: () => {},
		onSwipeLeft: () => {},
	};
	constructor(props) {
		super(props);
		//as we will change the ValueXY manually rather than using spring(),timing()etc.so now we will define a animted ValueXY inside the constructor.so we setup a default position with new animated ValueXY.
		//position is the animated ValueXY/current position.
		const position = new Animated.ValueXY();

		//traditionally panResponder is setted up inside the component constructor.
		/*we create a local instance of the panResponder which will handled the user's input.since it is a local variable/instance so
		we need to make a reference to it inside other functions to make use of it,so we have to assign it to a state variable*/
		//panResponder has many lifecycle methods,as few of them are discussed below.
		const panResponder = PanResponder.create({
			/*this function will be callled anytime a user tap on the screen.it return true b/c
      when a user tap on the screen so, this ftn is responsible for handling that gestures.
      if we dont want panResponder for handling that gestures we will set its value to false.
      */
			onStartShouldSetPanResponder: () => true,
			//anytime when user drag/move a pressed element(image/text etc),this callback ftn will be called many many time.
			//1st argument is always called event.this event is an object has some amount of information that describes what element is pressed on by the user.bur event is rare to use.
			/*2nd argument is gesture which has enough information that describes what the user is doing with his finger on the screen.
      So it has also some information what is pixel value the user is pressing down on and the user how quickly move fingers on the screen.this arg will be used more frequently*/
			onPanResponderMove: (event, gesture) => {
				//console.log('this is gesture',gesture)
				//dx=how far the user moved the finger in the x plane,and dy=how far the user moved the finger in the y plane,so it is the distance covered by the user finger on the screen in the single gesture(1 gesture=user tapped,dragged and released)
				//setValue() is used to change/update the default/current position xy values.So this is the big link/bond b/w gesture and animation.
				position.setValue({ x: gesture.dx, y: gesture.dy });
			},
			//this will be called any time the user release after pressing/moving/draging the element on the screen.
			onPanResponderRelease: (event, gesture) => {
				//if positive dx swipe right
				if (gesture.dx > SWIPE_THRESHOLD) {
					this.forceSwipe('right');
					//if -ive dx swipe left
				} else if (gesture.dx < -SWIPE_THRESHOLD) {
					this.forceSwipe('left');
				} else {
					this.resetPosition();
				}
			},
		});
		/*As we created above a local instance of the panResponder and position which will handled the user's input.since they are local variable/instance so
		we need to make a reference to it inside other functions to make use of it,so we have to assign each of them to a state variables*/
		this.state = { panResponder, position, index: 0 };
	}
	//this life cycle method is called whenever the component is about to be rerendered with new props.
	//here nextProps are the new props which will be compared with old props.
	UNSAFE_componentWillReceiveProps(nextProps) {
		/*it means new data array has same type of data as that of old data array.This comparison is not about the internel object numbers inside the arrays.
		 so if set of array[a,b,c] is replaced with with array[x,y,z] then set the index value to zero for this new array elements.*/
		if (nextProps.data !== this.props.data) {
			this.setState({ index: 0 });
		}
	}

	UNSAFE_componentWillUpdate() {
		//this is used for android compatibility
		UIManager.setLayoutAnimationEnabledExperimental &&
			UIManager.setLayoutAnimationEnabledExperimental(true);
		//this tell react native that next when this componenet is rerendered,then animate any change occur in the component.(like here the change is the cards change their position when swipe out one card.)
		LayoutAnimation.spring();
	}
	//this ftn is used to reset the element/item to the default position after releasing it.
	resetPosition() {
		//spring is used to change the value of the position.
		Animated.spring(this.state.position, {
			toValue: { x: 0, y: 0 },
		}).start();
	}
	//this ftn is used to swipe the card left or right out of the list in linear fasion,so that the swipped card will be vinished from the screen.
	forceSwipe(direction) {
		let x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
		//timing() is used for linear motion instead of bouncing motion.
		Animated.timing(this.state.position, {
			toValue: { x, y: 0 },
			duration: SWIPE_OUT_DURATION,

			//after the above animation completion this onSwipeComplete ftn will be called.
		}).start(() => this.onSwipeComplete(direction));
	}

	onSwipeComplete(direction) {
		const { onSwipeLeft, onSwipeRight, data } = this.props;
		//item will be updated with the next data item,when the current data item is swiped out and index in incremented
		const item = data[this.state.index];
		direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
		//to set the next item to the default position,when it comes to take place of the first swiped out item.
		this.state.position.setValue({ x: 0, y: 0 });
		this.setState({ index: this.state.index + 1 });
	}

	//we create this ftn b/c we have to pass many properties to the style.So for code cleaning we create this ftn.
	getCardStyle() {
		const { position } = this.state;
		/*interpolation tie one property to the other via scaling them to each other.this system allow us to relate/associate one set/scale of values to
		 the other set of values.values of both sets are related to each other in a linear fasion/corresponding/propotional to each to each other*/
		//we take just x value because we want to rotate the element only in the horizontal direction
		//rotate is the interpolation obj.
		const rotate = position.x.interpolate({
			//1st scale:inputRange is the distance on the screen covered by finger.
			//instead of using hard coded value(-500units and 500units).we use the screen width of the device and number 1.5 is used to reduce the rotation intensity/effect.
			inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
			//2nd scale:outputRange is the amount of rotation
			outputRange: ['-120deg', '0deg', '120deg'],
		});
		return {
			...position.getLayout(),
			/*transform property accepts an array inside of which we can specify a number different transforms that the card should contain.so
			rotate is one of the transforms*/
			//we instead of use a hard coded value/constant value(45deg) for rotation we use the rotate obj which will give us a dynamic value coming through comparing the inputRange with the outputRange in the interpotion process .
			transform: [{ rotate }],
		};
	}

	renderCards() {
		if (this.state.index >= this.props.data.length) {
			return this.props.renderNoMoreCards();
		}
		return this.props.data
			.map((item, index) => {
				//since we donot want to show those cards which are already swiped out of the list,so we return null.
				if (index < this.state.index) {
					return null;
				}
				//we only want to animate the top  card in the array list.
				if (index === this.state.index) {
					return (
						// {...this.state.panResponder.panHandlers} is used to tie the panResponder instance to this root View element/cards list(the whole list will be moved).later on we will tie it to the individual card
						//panHandlers property is the object of panResponder methods
						//this panHandlers is an object that has a bunch of callbacks that intercepts user presses.
						//by three dots we spreading all those properties/panResponder lifecycle methods over the view.
						//style={this.state.position.getLayout()} is used to setup the position of the View element.
						<Animated.View
							key={item.id}
							/*The z-index property specifies the stack order of an element.An element with greater stack order is always in front of an element with a lower stack order.
								Note: z-index only works on positioned elements (position: absolute, position: relative, position: fixed, or position: sticky).*/
							style={[this.getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
							{...this.state.panResponder.panHandlers}
						>
							{this.props.renderCard(item)}
						</Animated.View>
					);
				}

				return (
					//we use Animated.View to stop rerendering the items which cause to produce flashing.
					<Animated.View
						key={item.id}
						//{ top: 10 * (index - this.state.index) } to cascade the cards upon each other.
						style={[
							styles.cardStyle,
							/*The z-index property specifies the stack order of an element.An element with greater stack order is always in front of an element with a lower stack order.
								Note: z-index only works on positioned elements (position: absolute, position: relative, position: fixed, or position: sticky).*/
							{ top: 10 * (index - this.state.index), zIndex: 5 },
						]}
					>
						{this.props.renderCard(item)}
					</Animated.View>
				);
				//it will reverse the order of  the elements of the array created by map();
			})
			.reverse();
	}

	render() {
		return <View>{this.renderCards()}</View>;
	}
}
const styles = StyleSheet.create({
	cardStyle: {
		//absolute property is used for the elements/cards to stack up with each other.
		//note that absolute property is not working under the ScrollView parental element.
		position: 'absolute',
		// //note that when we use animation properties in our app,then we will not use left/right properties because they have conflict with animations and would not work correctly.
		// left: 0,
		// right:0,
		//as absolute property is used above for the elements/cards so,they get shrink to the minimum width to be displayed.so we set its width to the screen width
		width: SCREEN_WIDTH,
	},
});

export default Deck;
