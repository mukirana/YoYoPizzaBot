// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const admin=require('firebase-admin');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
admin.initializeApp({
  credential:admin.credential.applicationDefault(),
  databaseURL: 'ws://yo-yo-pizza-b90e0.firebaseio.com/'
});

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 function getUserDetail(agent){
  const pizza=agent.parameters.pizza;
  const size=agent.parameters.size;
  const name=agent.parameters.name;
  const contact=agent.parameters.contact;
  const address=agent.parameters.address;
 var status='Under Processing';
 
  //var mail = mailid;
  return admin.database().ref(contact).set({
    pizza: pizza,
    size: size,
    address: address,
    name:name,
    status: status
  });
 }
  function getStatus(agent){
     const st = agent.parameters.contact;
     agent.add('Hi your pizza is under processing');
  }
   function getStatus2(agent){
      
     const st = agent.parameters.contact;
      if(st!==null){
        agent.add(`Hi your Pizza is under processing`);
      }else{
      	agent.add(`Please enter valid contact number`);
      }
    // return admin.database().ref(st).once('value').then((snapshot) =>{
    //  const value=snapshot.child('status').val();
    //   const name = snapshot.child('name').val();
    //  if(value!==null){
     //   agent.add(`Hi ${name} your Pizza is ${value}`);
   //   }else{
    //  	agent.add(`Please enter valid contact number`);
   //   }
  //  });
    
  }
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Order Pizza', getUserDetail);
  intentMap.set('status', getStatus);
  intentMap.set('GetStatus2', getStatus2);
  agent.handleRequest(intentMap);
});
