### Module 2

Production orders could get very complex. Typically, they consist of detailed scheduling, bill of material, several activities, packing, shipping, and much more. In this tutorial, we have to reduce the scope. We are going to learn the technics how to build stuff like that in a very minimal scenario.

#### Intro

Welcome back to the drawing board. To build our second module, we start again with the architectural session.
This time we will advance the drawing from our first session with our new use case. In addition, we learn what Local-Twins are, how they are connected to events, what event-tags are, and how to use all of that to build scalable systems.

Looking back at our tutorial factory, we start to zoom out a bit to realize the second module. In this use case, we are going to connect the office and the worker at the machine.
According to each incoming customer order, a production order gets generated. Those production orders should be tracked during the production process.

Production orders could get very complex. Typically, they consist of detailed scheduling, bill of material, several activities, packing, shipping, and much more. In this tutorial, we have to reduce the scope. We are going to learn the technics how to build stuff like that in a very minimal scenario.

As a minimal valuable product, the worker will start the production order by clicking a button on a tablet and finish it with another button as soon the order is completed.

Lists of all interesting production orders at both apps will allow a quick overview and better load balancing at the different machines.

So, let's dive right into it and open our draw.io sheet from the last module or download it from [here]

#### Domain Modeling

For completeness, we start with the Domain modeling session again. We are going to add the required modules as they appear in the factory and add the required key features to them.

,--------------------------------------.
| Production order |
| - Create new production orders |
| - Assign production order to machine |
| - Display active production orders |
`--------------------------------------´

,--------------------------------------.
| Work Logging |
| - Display assigned production order |
| - Start and finish production order |
| - Show current production order |
`--------------------------------------´

It should be straightforward for you to add that to the Overview page.
This is what I came up with. I placed it this way to symbolize where the components are in the factory.

[IMAGE]

#### Eventstorming

Next, we can jump to the EventStorming tab in our draw.io sheet and copy the new components over to this.

Our start position should look like that now.

[IMAGE]

As we reduced our scope drastically, we start with the Office PC.

looking up the required features, we can combine the `Create new production orders` and `Assign production order to machine` into one action and define a event, that contains the order information and the assigned machine.

Let's call it `productionOrderCreated` containing the orderId, machineId, and other order metaData. You could add more events like `productionOrderUpdated` or `productionOrderReleased`, but I hope you will get the idea.

On the machine terminal we have two events. One to starte the production order and one announce that we finish it. We are going to call them: `and`. the data are pretty strate forward. To know on which machine the event is triggered, we need the machineId and we need the orderId to know what production order changed.

Here is my event sourcing sheet. If you like to define the `productionOrderCreated` event completely, add an additional section with all metadata you like to add to the event. Some examples could be amount, product, customerData, scheduledStart, dueDate, ...

[IMAGE]

#### TwinMapping

Finally the new stuff starts. Even if it is very good to practice old stuff again and again, the new things are alway more exciting.

We will introduce now the local twins.

As you read already in the "how actyx works" section. The local twins are code units/state machines, representing entities in the real world. They could be a machine, a robot, a worker, a material request, or a production order.
those local twins subscribe to events and react to them by an behaviour a developer has to programm. How they exactly work is not important for our design session for now. If we build more complex cases, we need a deeper understanding to model them as required. Right now, we only need to know, they represent any entity on the shop floor.

To to start simple, we will define two twins. The first one will represent a list of all production orders in the _current_ state and a machine twin who represent the current task running on a given machine.

Let's create a new tab in our draw.io sheet and call them TwinMapping. Copy all events from the EventStorming page to the TwinMapping page. That should look like that.

[IMAGE]

Before we place our event in the right position, we should know some things in advance.

As we saw already in module one, the events are not connected to a local twin. It is good practice to add the events to the twin representing the entity the event is handling. There mainly fore cases of how an event could be placed in the sheet.

1. The propose if the event is assigned to one local twin.
   e.g.: `ProductionOrderPlaced(orderId, ...)` to create a specific production order
   Place the event under the local twin responsible for that given entity.

2. An event is used by different local twins, but its primary purpose is clearly assigned.
   e.g. `MaterialRequestAssigned(requestId, forkliftId, ...)`: The material request and the forklift could both be interested in the event, but the event should be defined in the material request.

Place the event under the local twin it is clearly assigned to

3. An event is used by many local twins, and it is not obvious where the event should be.
   e.g. `ObjectPickedUpFrom(actorType, actorId, objectType, objectId, position, ...)` Even if this is not an ordinary event. There are cases where you like to track such data.

Place the event without a local twin somewhere on the side.

4. Events for use-cases who do not need a local twin for now
   e.g. `machineStatusChanged(device, state, ...)` from module 1
   Place the event without a local twin somewhere on the side.

Please, create only the local twins you need and not all possible or interesting ones.

Now, we have to add our required local twins. Starting with the ProductionOrdersTwin and arranging all related events under it with some space. We'll fill this up later. It could look like this:

[IMAGE]

Please, leave enough space between the events. We will fill it up in the next step.

By adding the `MachineTwin`, we recognize the machineStateChanged event could be interesting, but not for our current use-case. We can move the `machineStatusChanged(...)` to the off for now. The `productionOrderStarted(orderId, machineId)` and `productionOrderFinished(orderId, machineId)` events are the information we are looking for. To symbolize this, we add arrows. This way, we can declare that the ProductionOrdersTwin owns the event, but the MachineTwin also consumes it.

This is, how my current sheet looks like:

[IMAGE]

Finally, we can add more notes for the programmer below those blocks. We'll define some local twins with their states and state transitions in the next module.
For now, we simply add some short hints, what data the local twin will keep.

[IMAGE]

#### Event Tagging

Actyx uses tags to index events. We can add as many tags to events as we like. Tags are not fancy; they are only strings. If we publish an event with a tag, we can query it from actyx. To build more exciting queries, you can use `and` and `or` to get events with different tags.

A good practice for tags is to scope them literarily. For example, if you have a MachineStateChangedEvent, good tags would be `Machine` and `Machine.state`. With this schema of tags, you can query all events that happen at a machine if other machine events are already available.
In addition, we could use the `Machine.state` tag to get all MachineStateChanged events. A little spoiler here: We are going to use this in the next module to create RegistryTwins.

To get all events of a specific machine is currently very hard. We would have to query all events and filter them out by the included machineId. If we might have just one machine, there is no difference. But, if we have 50 machines, only 2% of those events are interesting for us.
The solution is simple, we modify the tag and append the machineId. `Machine:Machine 1`. Looks better, but we lost the possibility to query all machine events. What we should do is that we have all three tags together. `Machine`, `Machine:Machine 1` and `Machine.state`.

This Id pattern is so common that actyx adds it as function to the `Tag`. (`Tag('Machine').withId('Machine 1')`)

Enough theory. Let's use it for our events.
First, copy all events, arrows, and the local twins to a new tap. You could do it in one tab, but it will be very messy very soon if you add more notes during the TwinMapping session.

[IMAGE]

Next, to get the ProductionOrdersTwin working, we have to add the `ProductionOrder` tag to the events under it and add it as subscribed tag directly under the ProductionOrdersTwin. We do not add an id to the tags because we handle all active production orders in one twin. We are going to improve this later with one ProductionOrderTwin per id, but this requires some more patterns we skip for now.

[IMAGE]

To realize the arrows to the `MachineTwin`, we simply could subscribe to the `ProductionOrder` tag, but it is not clean at all, especially when we get more events in the future. A better solution is to add additional tags to demonstrate that we can subscribe to multiple tags as well. We define two new tags. `ProductionOrder.startedBy:machineId` and `ProductionOrder.finishedBy:machineId`. As you can see, I used the `ProductionOrder` scope and added the passive term `startedBy` to point out that the id is not the Id of the production order. `Tag('ProductionOrder.startedBy').withId('Machine 1')` feels very natural.

Finally, That is how it should look now:

[IMAGE]

If you hand over this design sheet to a colleague, he would know what events he should define, which local twins are required, what they should do, and what tag he should use for each event.

By the way, if you change the tags later, it always leads to a data loss in our logic. So the events are still available in actyx, but the subscription will only deliver the new events to the local twin.
