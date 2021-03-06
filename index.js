//'use strict';

//console.log('Loading function');
// array of vars strenght,int,dex
//var WarriorStats = [8,2,2];
//var RogueStats = [6,3,8];
//var WizardStats = [3,8,4];
//var NAMES =["Warrior","Rogue","Wizard"];
'use strict';

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to Dungeons and Dragons Adventurer are you a  sneaky rogue!, perhaps a brave warrior!, or a crafty wizard?, ' +
        'Please tell me your class by saying, my class is blank ';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me your class brave adventurer!';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Your quest has ended Goodbye Adventurer';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function  createClassAttributes(Class) { //createFavoriteColorAttributes(Class) {
    return {
        Class,
    };
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setClassInSession(intent, session, callback) {//setColorInSession
    const cardTitle = intent.name;
    const ClassSlot = intent.slots.Class;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    if (ClassSlot) {
        const Class = ClassSlot.value;
        sessionAttributes = createClassAttributes(Class);
        speechOutput = `You are a ${Class}. Ok that seems correct ` +
            `I shall aid you on your quest noble ${Class}.`
        repromptText = "You can ask me for helpful hints like stats or combat tips";
    } else {
        speechOutput = "I'm not sure your class. Please try again.";
        repromptText = "I'm not sure what your class is. You can tell me your " +
            'class?';
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getClassFromSession(intent, session, callback) {
    let Class;
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = 'get color from session end at let speech output';

    if (session.attributes) {
        Class = session.attributes.Class;
    }

    if (Class) {
        speechOutput = `Your adventure has ended see you next time`;//`Your class is ${Class}. Goodbye.`;
        shouldEndSession = true;
    } else {
        speechOutput = " I'm not sure what your class is? can you can say I am a warrior! I am a rogue! or I am a wizard";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}


// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'MyClassIsIntent') {
        setClassInSession(intent, session, callback);
    } else if (intentName === 'WhatsMyClassIntent') { //'WhatsMyColorIntent'//
        getClassFromSession(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        //console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if ( event.session && event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }
        
        if (event.request) {
            if (event.request.type === 'LaunchRequest') {
                onLaunch(event.request,
                    event.session,
                    (sessionAttributes, speechletResponse) => {
                        callback(null, buildResponse(sessionAttributes, speechletResponse));
                    });
            } else if (event.request.type === 'IntentRequest') {
                onIntent(event.request,
                    event.session,
                    (sessionAttributes, speechletResponse) => {
                        callback(null, buildResponse(sessionAttributes, speechletResponse));
                    });
            } else if (event.request.type === 'SessionEndedRequest') {
                onSessionEnded(event.request, event.session);
                callback();
            }
        }
    } catch (err) {
        callback(err);
    }
};
