Ext.define('MYOCD.NotifCenter',{
	singleton: true,
	events: {},
	addObserverForEvent: function(observer, eventName, handleFunction) {
		console.log("Add observer event: " + eventName);
		if (!this.events[eventName]) {
			this.events[eventName] = {
				observers: []
			}
		}
		if (this.events[eventName].observers.indexOf({observer: observer, handleFunction: handleFunction}) != -1) return;
		this.events[eventName].observers.push({
			observer: observer,
			handleFunction: handleFunction
		});
	},
	postEventNotif: function(sender, eventName, param) {
		console.log("post event: " + eventName);
		if (!this.events[eventName]) {
			this.events[eventName] = {
				observers: []
			}
			return;
		}
		for (var i = 0; i < this.events[eventName].observers.length; i++) {
			var observer = this.events[eventName].observers[i];
			observer.observer[observer.handleFunction.$name](sender, param);
		}
	},
	removeObserverOfEvent: function(observer, eventName) {
		if (!this.events[eventName]) {
			this.events[eventName] = {
				observers: []
			}
			return;
		}
		for (var i = 0; i < this.events[eventName].observers.length; i++) {
			if (observer == this.events[eventName].observers[i].observer) {
				this.events[eventName].observers.splice(i, 1);
				break;
			} 
		}
	},
	removeObserver: function(observer) {
		for (var key in this.events) {
			for (var i = 0; i < this.events[key].observers.length; i++) {
				if (observer == this.events[key].observers[i].observer) {
					this.events[key].observers.splice(i, 1);
					break;
				} 
			}
		}
	}
});