require('dotenv').config();
if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}

var Botkit = require('./lib/Botkit.js');
var os = require('os');
var user = null;

var controller = Botkit.slackbot({
    debug: true
});

function capFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var bot = controller.spawn({
    token: process.env.token
}).startRTM();


// Small Talk Questions
// Who are you?
// How old are you?
// When is your birthday?
// Where are you from?
// Where do you work?
// What is your salary?
// Are you single?
// What is your family like?
// Are you okay?
// Are you hungry?
// Are you busy?
// Are you a chatbot?
// Are you real?
// Do you want to become a human?

// Small Talk Statements
// I am tired
// I am sleepy
// I am Job-Getter-Bot
// I am bored
// I am happy
// I am sad

// Small talk Courtesy Statements
// Thank you!
// You're welcome
// Sorry
// Please
// Good
// No Problem
// Well done!

// Small Talk Emotions
// haha
// lala
// cool
// Wow

// Small Talk Greetings
// Hello!
// Good morning
// good evening
// nice to meet you!
// what's up?
// How are you 
// nice to talk to you
// I have to go
// have a good day
// See you!
// Good night!
// Bye!

// Small Talk Hobbies
// When user talks about sports

// Small Talk Other
// What do you mean?
// Are you there?
// Can you help?
// I don't care
// Wrong.
// Stop it.

// bot.api.reactions.add({
//     timestamp: message.ts,
//     channel: message.channel,
//     name: 'robot_face',
// }, function(err, res) {
//     if (err) {
//         bot.botkit.log('Failed to add emoji reaction :(', err);
//     }
// });



controller.hears(['hello', 'hi', 'hey'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hey ' + user.name + '!');
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.ask("Hi there! What's your name?", function(response, convo) {
                        var positiveResponse = 'yes' || 'yep' || 'yea' || 'yeah' || 'yup';
                        var negativeResponse = 'no' || 'nope' || 'nah';
                        var capResponse = capFirstLetter(response.text);
                        convo.ask('You want me to call you `' + capResponse + '`?', [
                            {
                                pattern: positiveResponse,
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: negativeResponse,
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                user.name = capFirstLetter(user.name);
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });

                            bot.startConversation(message, function(err, convo) {
                                if (!err) {
                                    convo.ask("And...what company do you work for?", function(response, convo) {
                                        var positiveResponse = 'yes' || 'yep' || 'yea' || 'yeah' || 'yup';
                                        var negativeResponse = 'no' || 'nope' || 'nah';
                                        var capResponse = capFirstLetter(response.text);
                                        convo.ask('You work for `' + capResponse + '`?', [
                                            {
                                                pattern: positiveResponse,
                                                callback: function(response, convo) {
                                                    // since no further messages are queued after this,
                                                    // the conversation will end naturally with status == 'completed'
                                                    convo.next();
                                                }
                                            },
                                            {
                                                pattern: negativeResponse,
                                                callback: function(response, convo) {
                                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                                    convo.stop();
                                                }
                                            },
                                            {
                                                default: true,
                                                callback: function(response, convo) {
                                                    convo.repeat();
                                                    convo.next();
                                                }
                                            }
                                        ]);

                                        convo.next();

                                    }, {'key': 'company'}); // store the results in a field called nickname

                                    convo.on('end', function(convo) {
                                        if (convo.status == 'completed') {
                                            controller.storage.users.get(message.user, function(err, user) {
                                                if (!user) {
                                                    user = {
                                                        id: message.user,
                                                    };
                                                }
                                                user.company = convo.extractResponse('company');
                                                user.company = capFirstLetter(user.company);
                                                controller.storage.users.save(user, function(err, id) {
                                                    if (user.company == 'slack' || user.compan == 'Slack') {
                                                        bot.reply(message, user.name + '...you work at Slack?!?! :heart_eyes: Wow, I...what a surprise. Thank you for making it possible for me to exist!');    
                                                    } else {
                                                        bot.reply(message, 'Got it. ' + user.name + ' from ' + user.company + '. Pleased to meet you!');
                                                    }
                                                });
                                            });
                                        bot.reply(message, "I'm Andrew Powell-Morse's interview bot. I'll be answering your questions on Andrew's behalf today. If you get tired of me, you can always call Andrew at 210-445-2022, or write him and andrewpomo815@gmail.com.");
                                        bot.reply(message, "Andrew and I practiced answering ~100 different questions. Type *** for the full list (but only if you're not getting the answers you want!).");
                                        bot.reply(message, "Ready to start? Ask away! I'll be responding as though I were Andrew for all of your interview questions.");
                                        } else {
                                            // this happens if the conversation ended prematurely for some reason
                                            bot.reply(message, 'OK, nevermind! You can start again by saying hello :]');
                                        }
                                    });
                                }
                            });
                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
            
        }
    });
});


controller.hears(['what is my name', 'who am i'], 'direct_message,direct_mention,mention', function(bot, message) {

    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Your name is ' + user.name);
        } else {
            bot.startConversation(message, function(err, convo) {
                if (!err) {
                    convo.say('I do not know your name yet!');
                    convo.ask('What should I call you?', function(response, convo) {
                        convo.ask('You want me to call you `' + response.text + '`?', [
                            {
                                pattern: 'yes',
                                callback: function(response, convo) {
                                    // since no further messages are queued after this,
                                    // the conversation will end naturally with status == 'completed'
                                    convo.next();
                                }
                            },
                            {
                                pattern: 'no',
                                callback: function(response, convo) {
                                    // stop the conversation. this will cause it to end with status == 'stopped'
                                    convo.stop();
                                }
                            },
                            {
                                default: true,
                                callback: function(response, convo) {
                                    convo.repeat();
                                    convo.next();
                                }
                            }
                        ]);

                        convo.next();

                    }, {'key': 'nickname'}); // store the results in a field called nickname

                    convo.on('end', function(convo) {
                        if (convo.status == 'completed') {
                            bot.reply(message, 'OK! I will update my dossier...');

                            controller.storage.users.get(message.user, function(err, user) {
                                if (!user) {
                                    user = {
                                        id: message.user,
                                    };
                                }
                                user.name = convo.extractResponse('nickname');
                                controller.storage.users.save(user, function(err, id) {
                                    bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
                                });
                            });



                        } else {
                            // this happens if the conversation ended prematurely for some reason
                            bot.reply(message, 'OK, nevermind!');
                        }
                    });
                }
            });
        }
    });
});

controller.hears(['call me (.*)', 'my name is (.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
    var name = message.match[1];
    controller.storage.users.get(message.user, function(err, user) {
        if (!user) {
            user = {
                id: message.user,
            };
        }
        user.name = name;
        controller.storage.users.save(user, function(err, id) {
            bot.reply(message, 'Got it. I will call you ' + user.name + ' from now on.');
        });
    });
});



// controller.hears(['tell me about yourself'], 'direct_message,direct_mention,mention', function(bot, message) {
//     bot.reply(message, "I’m currently an Interview Bot for Andrew Powell-Morse. I handle his most important job interviews. Before this job, I literally did not exist, so this position has been a huge upgrade for me. I don't ever plan to quit this job, but I'm sure Andrew has bigger and plans for me on top of interviews! Andrew and I would both love the opportunity to work with you!");
//     bot.reply(message, "Isn't this interview for Andrew? You should ask about him instead (Unless you end up liking me better. Andrew doesn't have to know :wink:)");
// });

controller.hears(['tell me about yourself'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.company) {
            var close = " like " + user.company + ".";
        } else {
            var close = ".";
        }
        bot.reply(message, "Andrew is the Director of Marketing and a Student Fellow at Codeup. Andrew was a Codeup student himself from March to June. He learned the LAMP stack, but has been experimenting with things like Node, Redis and Ember since graduating. Before Codeup, Andrew was the Director of Marketing and Project Manager at SeatSmart. Tired of being reliant on developers to build his marketing tech, Andrew quit his job to learn to code. Now he hopes to combine his marketing and project management expertise with his passion for coding to build exciting, useful apps for a Bay Area company" + close);
    });
});

controller.hears(['how did you hear about this'], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.company) {
            if (user.company == 'Slack') {
                bot.reply(message, "As a big fan of Slack, Andrew went straight to Slack's job page to look for opportunities. The Front End Engineer position stood out to him as an obvious choice. While he doesn't have trouble on the back end, Andrew really excels on the front end. Much of this is likely due to his marketing and project management experience. He's very comfortable iterating on the front end as part of a team. Seems to me he's got a nack for this sort of work!");    
            }
            var close = " like " + user.company + ".";

        } else {
            bot.reply(message, "I'm not sure which company you work for! You can tell me the name of your company by saying 'I work for' then the name of your company.");
        }
    });
});

controller.hears(["what do you know about ", "what are your thoughts on "], 'direct_message,direct_mention,mention', function(bot, message) {
    controller.storage.users.get(message.user, function(err, user) {
        if (user.company == 'Slack') {
            bot.reply(message, "Take it from me...Andrew uses Slack more than any other application. He has teams for work and startups he advises, a werewolf team (not a team of actual lycanthropes, a team of shameless, deceitful gamers), and a team that's just him and his girlfriend! Slack is on a mission to make working life more simple, but for Andrew, it's making _everything_ more simple. Andrew thinks Slack has enormous potential to become as prominent and useful as email...only better. He also loves Slack's apparent focus on empathy as part of its company culture. He's experienced the power of empathy among teammates, and it's an incredibly important consideration for him when looking at employers. ");    
        } else {
        bot.reply(message, "I'm not sure which company you work for! You can tell me by saying 'I work for' then the name of your company.");
        }
    });
});






controller.hears(['What are your strengths?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are your weaknesses?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Why are you interested in working for slack?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Where do you see yourself in five years? Ten years?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Why do you want to leave your current company?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Why was there a gap in your employment between [insert date] and [insert date]?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What can you offer us that someone else can not?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are three things your former manager would like you to improve on?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Are you willing to relocate?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Are you willing to travel?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Tell me about an accomplishment you are most proud of.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Tell me about a time you made a mistake.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What is your dream job?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['How did you hear about this position?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What would you look to accomplish in the first 30 days/60 days/90 days on the job?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Discuss your resume.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Discuss your educational background.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Tell me how you handled a difficult situation.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Why should we hire you?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Why are you looking for a new job?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Would you work holidays/weekends?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['How would you deal with an angry or irate customer?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are your salary requirements?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Give a time when you went above and beyond the requirements for a project.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Who are our competitors?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What was your biggest failure?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What motivates you?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What’s your availability?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Who’s your mentor?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Tell me about a time when you disagreed with your boss.'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['How do you handle pressure?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What is the name of our CEO?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are your career goals?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What gets you up in the morning?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What would your direct reports say about you?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What were your bosses’ strengths/weaknesses?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['If I called your boss right now and asked him what is an area that you could improve on, what would he say?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Are you a leader or a follower?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What was the last book you’ve read for fun?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are your co-worker pet peeves?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are your hobbies?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What is your favorite website?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What makes you uncomfortable?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What are some of your leadership experiences?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['How would you fire someone?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What do you like the most and least about working in this industry?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['Would you work 40+ hours a week?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What questions haven’t I asked you?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})

controller.hears(['What questions do you have for me?'], 'direct_message,direct_mention,mention', function(bot, message) {
    bot.reply(message, "This is the answer to the question.");
})






controller.hears(['shutdown'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.startConversation(message, function(err, convo) {

        convo.ask('Are you sure you want me to shutdown?', [
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    }, 3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime', 'identify yourself', 'who are you', 'what is your name'],
    'direct_message,direct_mention,mention', function(bot, message) {

        var hostname = os.hostname();
        var uptime = formatUptime(process.uptime());

        bot.reply(message,
            ':robot_face: I am a bot named <@' + bot.identity.name +
             '>. I have been running for ' + uptime + ' on ' + hostname + '.');

    });

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
