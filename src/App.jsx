import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { BookOpen, Calculator, Flame, Settings, X, Check, RotateCcw, Plus, ArrowLeft, Layers, Trash2 } from "lucide-react";

const CARDS_DATA = [{"id": "v0", "deck": "vocab", "tag": "By the Letter", "front": "Aberration", "pos": "n", "back": "A departure from what is normal or expected.", "example": "The freak snowstorm in July was an aberration, not a sign of a shifting climate."}, {"id": "v1", "deck": "vocab", "tag": "Themed Vocab", "front": "Aboveboard", "pos": "adj", "back": "Honest and open, with no attempt to deceive.", "example": "She kept the negotiations aboveboard by sharing every document with both sides."}, {"id": "v2", "deck": "vocab", "tag": "Themed Vocab", "front": "Acme", "pos": "n", "back": "The highest point or peak of something.", "example": "Winning the championship marked the acme of her tennis career."}, {"id": "v3", "deck": "vocab", "tag": "By the Letter", "front": "Acrimony", "pos": "n", "back": "Bitterness and anger, especially in speech or disputes.", "example": "The divorce proceedings dragged on for years, full of acrimony."}, {"id": "v4", "deck": "vocab", "tag": "By the Letter", "front": "Affable", "pos": "adj", "back": "Friendly, easygoing, and pleasant to talk to.", "example": "The affable host made every guest feel instantly welcome."}, {"id": "v5", "deck": "vocab", "tag": "Top & Common Words", "front": "Alacrity", "pos": "n", "back": "Eager and cheerful readiness to do something.", "example": "He agreed to help with alacrity, dropping what he was doing at once."}, {"id": "v6", "deck": "vocab", "tag": "Themed Vocab", "front": "Amalgam", "pos": "n", "back": "A mixture or blend of different things.", "example": "The city's cuisine is an amalgam of Spanish, African, and Indigenous traditions."}, {"id": "v7", "deck": "vocab", "tag": "By the Letter", "front": "Ambiguous", "pos": "adj", "back": "Open to more than one interpretation; unclear.", "example": "His ambiguous answer left both sides thinking he agreed with them."}, {"id": "v8", "deck": "vocab", "tag": "Top & Common Words", "front": "Ambivalent", "pos": "adj", "back": "Having mixed or contradictory feelings about something.", "example": "She felt ambivalent about the promotion, excited but also wary of the added stress."}, {"id": "v9", "deck": "vocab", "tag": "By the Letter", "front": "Amenable", "pos": "adj", "back": "Willing to go along with something; easily persuaded.", "example": "He was amenable to changing the meeting time once he heard why."}, {"id": "v10", "deck": "vocab", "tag": "By the Letter", "front": "Amiable", "pos": "adj", "back": "Friendly and good natured.", "example": "Their amiable neighbor always waved and asked about their day."}, {"id": "v11", "deck": "vocab", "tag": "By the Letter", "front": "Amorphous", "pos": "adj", "back": "Lacking a clear shape, structure, or organization.", "example": "The committee's amorphous plan had no real steps or deadlines."}, {"id": "v12", "deck": "vocab", "tag": "Word Origins", "front": "Amuck", "pos": "adv", "back": "In a frenzied, out of control manner, as in run amuck.", "example": "The puppy ran amuck through the garden, scattering leaves everywhere."}, {"id": "v13", "deck": "vocab", "tag": "Themed Vocab", "front": "Anathema", "pos": "n", "back": "Something or someone intensely disliked or shunned.", "example": "Cutting corners on safety was anathema to the veteran engineer."}, {"id": "v14", "deck": "vocab", "tag": "By the Letter", "front": "Animosity", "pos": "n", "back": "Strong hostility or ill will.", "example": "Years of competition bred quiet animosity between the two labs."}, {"id": "v15", "deck": "vocab", "tag": "By the Letter", "front": "Anomalous", "pos": "adj", "back": "Deviating from what is normal or expected.", "example": "The anomalous reading was traced back to a faulty sensor."}, {"id": "v16", "deck": "vocab", "tag": "Themed Vocab", "front": "Apex", "pos": "n", "back": "The highest point; the peak.", "example": "The satellite reached the apex of its orbit just after launch."}, {"id": "v17", "deck": "vocab", "tag": "Themed Vocab", "front": "Apogee", "pos": "n", "back": "The highest point of achievement, or the farthest point in an orbit from Earth.", "example": "The album marked the apogee of the band's popularity."}, {"id": "v18", "deck": "vocab", "tag": "Themed Vocab", "front": "Apostasy", "pos": "n", "back": "Abandonment of a belief, principle, or party one once held.", "example": "His former colleagues called his change of party pure apostasy."}, {"id": "v19", "deck": "vocab", "tag": "Themed Vocab", "front": "Apotheosis", "pos": "n", "back": "The perfect example of something; the highest point of glorification.", "example": "The finale was the apotheosis of the season, tying every storyline together."}, {"id": "v20", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Arch", "pos": "adj", "back": "Playfully mischievous or knowingly sly, especially in tone.", "example": "She gave an arch smile before delivering the punch line."}, {"id": "v21", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Arrant", "pos": "adj", "back": "Complete and utter, used to intensify something negative.", "example": "That excuse was arrant nonsense, and everyone in the room knew it."}, {"id": "v22", "deck": "vocab", "tag": "Word Origins", "front": "Arriviste", "pos": "n", "back": "A person who has recently gained wealth or status and is eager to be accepted.", "example": "The old guard looked down on the arriviste who had bought his way into the club."}, {"id": "v23", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Artful", "pos": "adj", "back": "Skillful, especially in a clever or crafty way.", "example": "Her artful negotiating got the price down without anyone feeling cheated."}, {"id": "v24", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Artifice", "pos": "n", "back": "Clever trickery or deception used to create an effect.", "example": "The magician's act depended entirely on artifice and misdirection."}, {"id": "v25", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Artless", "pos": "adj", "back": "Natural and without deception; lacking cunning.", "example": "His artless honesty surprised interviewers used to rehearsed answers."}, {"id": "v26", "deck": "vocab", "tag": "By the Letter", "front": "Attenuate", "pos": "v", "back": "To reduce the force, effect, or value of something.", "example": "The thick curtains attenuated the noise from the street below."}, {"id": "v27", "deck": "vocab", "tag": "Top & Common Words", "front": "Auspicious", "pos": "adj", "back": "Showing signs of future success; favorable.", "example": "Landing the internship on her first try felt like an auspicious start."}, {"id": "v28", "deck": "vocab", "tag": "Money & Finance", "front": "Avarice", "pos": "n", "back": "Extreme greed for wealth.", "example": "Avarice drove the executive to cut corners no one else would."}, {"id": "v29", "deck": "vocab", "tag": "Themed Vocab", "front": "Badger", "pos": "v", "back": "To pester someone persistently.", "example": "The kids badgered their dad for a dog until he finally gave in."}, {"id": "v30", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Base", "pos": "adj", "back": "Morally low or lacking dignity.", "example": "Stealing from a charity is about as base as it gets."}, {"id": "v31", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Beatific", "pos": "adj", "back": "Blissfully happy; showing serene joy.", "example": "The toddler wore a beatific smile after her first bite of cake."}, {"id": "v32", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Beautiful", "pos": "adj", "back": "Pleasing to look at; attractive.", "example": "The valley looked beautiful under the season's first snow."}, {"id": "v33", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Becoming", "pos": "adj", "back": "Flattering or suitable in appearance.", "example": "The tailored jacket was far more becoming than her old coat."}, {"id": "v34", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Beg", "pos": "v", "back": "To ask for something urgently. Note: 'beg the question' means to assume the conclusion, not to raise a question.", "example": "Technically, an argument that assumes its conclusion begs the question."}, {"id": "v35", "deck": "vocab", "tag": "High Difficulty", "front": "Belie", "pos": "v", "back": "To give a false impression of; to contradict.", "example": "His calm voice belied the panic he felt underneath."}, {"id": "v36", "deck": "vocab", "tag": "Themed Vocab", "front": "Bellicose", "pos": "adj", "back": "Eager to fight; aggressively hostile.", "example": "The senator's bellicose speech pushed the room toward war footing."}, {"id": "v37", "deck": "vocab", "tag": "High Difficulty", "front": "Betray", "pos": "v", "back": "To be disloyal to, or to reveal unintentionally.", "example": "Her trembling hands betrayed how nervous she really was."}, {"id": "v38", "deck": "vocab", "tag": "Themed Vocab", "front": "Bilious", "pos": "adj", "back": "Bad tempered, as if sick to one's stomach.", "example": "The critic's bilious review tore the film apart line by line."}, {"id": "v39", "deck": "vocab", "tag": "Top & Common Words", "front": "Bleak", "pos": "adj", "back": "Lacking hope or warmth; desolate.", "example": "The job market looked bleak for new graduates that year."}, {"id": "v40", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Blinkered", "pos": "adj", "back": "Having a narrow, limited outlook.", "example": "His blinkered view of the market ignored every competitor overseas."}, {"id": "v41", "deck": "vocab", "tag": "Word Origins", "front": "Byzantine", "pos": "adj", "back": "Excessively complicated, often involving intrigue.", "example": "Untangling the company's byzantine approval process took three separate meetings."}, {"id": "v42", "deck": "vocab", "tag": "Themed Vocab", "front": "Cadaverous", "pos": "adj", "back": "Pale and thin, resembling a corpse.", "example": "After the flu, he looked cadaverous, all cheekbones and shadows."}, {"id": "v43", "deck": "vocab", "tag": "By the Letter", "front": "Calumny", "pos": "n", "back": "A false and malicious statement meant to damage someone's reputation.", "example": "The tabloid's story was pure calumny, invented from nothing."}, {"id": "v44", "deck": "vocab", "tag": "Top & Common Words", "front": "Candid", "pos": "adj", "back": "Truthful and straightforward, even when unflattering.", "example": "Her candid feedback stung, but it made the final draft much better."}, {"id": "v45", "deck": "vocab", "tag": "By the Letter", "front": "Castigate", "pos": "v", "back": "To criticize or punish harshly.", "example": "The coach castigated the team for their sloppy defense."}, {"id": "v46", "deck": "vocab", "tag": "Themed Vocab", "front": "Catalyst", "pos": "n", "back": "Something that triggers a significant change or event.", "example": "The factory closing was the catalyst for the town's slow decline."}, {"id": "v47", "deck": "vocab", "tag": "Themed Vocab", "front": "Catholic", "pos": "adj", "back": "Universal; broad in range or sympathies (lowercase c).", "example": "Her catholic taste in music ran from baroque to death metal."}, {"id": "v48", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Censor", "pos": "v", "back": "To suppress or remove parts of something considered objectionable.", "example": "The studio censored two scenes before the film's release."}, {"id": "v49", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Censure", "pos": "v", "back": "To formally criticize or reprimand.", "example": "The senate voted to censure the official for the leaked memo."}, {"id": "v50", "deck": "vocab", "tag": "By the Letter", "front": "Chary", "pos": "adj", "back": "Cautious and wary.", "example": "Burned once, she was chary of signing any contract without a lawyer."}, {"id": "v51", "deck": "vocab", "tag": "By the Letter", "front": "Chastise", "pos": "v", "back": "To scold or reprimand severely.", "example": "The professor chastised the class for skipping the assigned reading."}, {"id": "v52", "deck": "vocab", "tag": "Word Origins", "front": "Chauvinist", "pos": "n", "back": "A person with excessive or biased loyalty to their own group.", "example": "The commentator's chauvinist rants ignored every foreign team's achievements."}, {"id": "v53", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Check", "pos": "v", "back": "To restrain or hold back.", "example": "She had to check her temper before responding to the email."}, {"id": "v54", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Checkered", "pos": "adj", "back": "Marked by both good and bad periods; inconsistent.", "example": "His checkered past included both a felony and a humanitarian award."}, {"id": "v55", "deck": "vocab", "tag": "Themed Vocab", "front": "Choleric", "pos": "adj", "back": "Easily angered; bad tempered.", "example": "The choleric chef was famous for screaming at the smallest mistake."}, {"id": "v56", "deck": "vocab", "tag": "By the Letter", "front": "Churlish", "pos": "adj", "back": "Rude and ill mannered.", "example": "It felt churlish to complain about the free upgrade, but he did anyway."}, {"id": "v57", "deck": "vocab", "tag": "By the Letter", "front": "Cogent", "pos": "adj", "back": "Clear, logical, and convincing.", "example": "Her cogent argument won over even the skeptics on the panel."}, {"id": "v58", "deck": "vocab", "tag": "By the Letter", "front": "Commensurate", "pos": "adj", "back": "Proportional in size or degree to something else.", "example": "His raise was commensurate with the extra responsibilities he had taken on."}, {"id": "v59", "deck": "vocab", "tag": "By the Letter", "front": "Conciliate", "pos": "v", "back": "To make peace with; to win over.", "example": "The manager tried to conciliate both sides before the dispute escalated."}, {"id": "v60", "deck": "vocab", "tag": "Top & Common Words", "front": "Contentious", "pos": "adj", "back": "Likely to cause disagreement; controversial.", "example": "Zoning changes are always a contentious topic at town meetings."}, {"id": "v61", "deck": "vocab", "tag": "Top & Common Words", "front": "Contrite", "pos": "adj", "back": "Feeling regret for wrongdoing.", "example": "He offered a contrite apology the morning after the argument."}, {"id": "v62", "deck": "vocab", "tag": "Money & Finance", "front": "Cupidity", "pos": "n", "back": "Greed, especially for money or possessions.", "example": "Cupidity, not need, explained why he kept expanding the empire."}, {"id": "v63", "deck": "vocab", "tag": "Themed Vocab", "front": "Curmudgeon", "pos": "n", "back": "A grumpy, often older, person who is easily irritated.", "example": "The old curmudgeon next door complained about every kid on a bike."}, {"id": "v64", "deck": "vocab", "tag": "Themed Vocab", "front": "Defenestrate", "pos": "v", "back": "To throw someone or something out of a window, or figuratively to abruptly remove from power.", "example": "The board defenestrated the CEO within a week of the scandal."}, {"id": "v65", "deck": "vocab", "tag": "Money & Finance", "front": "Defray", "pos": "v", "back": "To provide money to pay part or all of a cost.", "example": "The scholarship helped defray the cost of her first year."}, {"id": "v66", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Demur", "pos": "v", "back": "To raise objections or show reluctance.", "example": "When asked to work the holiday, she politely demurred."}, {"id": "v67", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Demure", "pos": "adj", "back": "Modest and reserved in behavior.", "example": "The bride wore a demure, high necked gown for the ceremony."}, {"id": "v68", "deck": "vocab", "tag": "Themed Vocab", "front": "Desecrate", "pos": "v", "back": "To treat something sacred with violent disrespect.", "example": "Vandals desecrated the old cemetery, and the town was outraged."}, {"id": "v69", "deck": "vocab", "tag": "Themed Vocab", "front": "Diabolical", "pos": "adj", "back": "Extremely evil or wicked.", "example": "The villain's diabolical plan involved three separate betrayals."}, {"id": "v70", "deck": "vocab", "tag": "Themed Vocab", "front": "Disabuse", "pos": "v", "back": "To free someone from a mistaken belief.", "example": "The mentor quickly disabused him of the idea that grad school would be easy."}, {"id": "v71", "deck": "vocab", "tag": "High Difficulty", "front": "Disinterested", "pos": "adj", "back": "Impartial; having no personal stake in the outcome. Different from uninterested.", "example": "As a disinterested judge, she had no ties to either team."}, {"id": "v72", "deck": "vocab", "tag": "Top & Common Words", "front": "Disparate", "pos": "adj", "back": "Fundamentally different or distinct from each other.", "example": "The panel brought together disparate fields, from robotics to poetry."}, {"id": "v73", "deck": "vocab", "tag": "Themed Vocab", "front": "Dog", "pos": "v", "back": "To follow persistently, often as a problem.", "example": "Rumors of the merger dogged the company for months."}, {"id": "v74", "deck": "vocab", "tag": "Money & Finance", "front": "Dupe", "pos": "n/v", "back": "To trick or deceive someone; also, a person who is easily deceived.", "example": "The scammer duped dozens of retirees out of their savings."}, {"id": "v75", "deck": "vocab", "tag": "Top & Common Words", "front": "Egregious", "pos": "adj", "back": "Outstandingly bad; shocking.", "example": "The report uncovered an egregious pattern of billing errors."}, {"id": "v76", "deck": "vocab", "tag": "Themed Vocab", "front": "Embroiled", "pos": "adj", "back": "Deeply and unpleasantly involved in an argument or conflict.", "example": "The two companies were embroiled in a lawsuit for over a decade."}, {"id": "v77", "deck": "vocab", "tag": "Top & Common Words", "front": "Enervate", "pos": "v", "back": "To drain of energy or vitality.", "example": "The humid afternoon left everyone enervated by the time class ended."}, {"id": "v78", "deck": "vocab", "tag": "High Difficulty", "front": "Equivocal", "pos": "adj", "back": "Open to more than one interpretation; deliberately vague.", "example": "His equivocal statement let both sides claim he had agreed with them."}, {"id": "v79", "deck": "vocab", "tag": "Top & Common Words", "front": "Equivocate", "pos": "v", "back": "To use vague or ambiguous language to avoid committing to a position.", "example": "The witness equivocated every time he was asked for a specific date."}, {"id": "v80", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Err", "pos": "v", "back": "To make a mistake.", "example": "When in doubt, she preferred to err on the side of caution."}, {"id": "v81", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Errand", "pos": "n", "back": "A short trip taken to complete a specific task.", "example": "He ran a quick errand to the pharmacy before dinner."}, {"id": "v82", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Errant", "pos": "adj", "back": "Straying from the proper course or standards; wandering.", "example": "An errant golf ball shattered the neighbor's window."}, {"id": "v83", "deck": "vocab", "tag": "Top & Common Words", "front": "Erratic", "pos": "adj", "back": "Irregular or unpredictable in behavior.", "example": "His erratic driving worried everyone else on the road."}, {"id": "v84", "deck": "vocab", "tag": "By the Letter", "front": "Excoriate", "pos": "v", "back": "To criticize someone severely.", "example": "The op-ed excoriated the mayor for the delayed response."}, {"id": "v85", "deck": "vocab", "tag": "By the Letter", "front": "Execrate", "pos": "v", "back": "To feel or express great loathing for.", "example": "Historians execrate the general for the massacre he ordered."}, {"id": "v86", "deck": "vocab", "tag": "By the Letter", "front": "Exegesis", "pos": "n", "back": "A detailed critical explanation of a text.", "example": "The seminar spent a full semester on exegesis of a single poem."}, {"id": "v87", "deck": "vocab", "tag": "By the Letter", "front": "Exhort", "pos": "v", "back": "To strongly encourage or urge someone to do something.", "example": "The coach exhorted her players to give one more push before the final whistle."}, {"id": "v88", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Expansive", "pos": "adj", "back": "Broad in scope, or open and talkative.", "example": "After a glass of wine, he grew expansive about his travel plans."}, {"id": "v89", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Expunge", "pos": "v", "back": "To erase or remove completely, especially from a record.", "example": "The judge agreed to expunge the old charge from his record."}, {"id": "v90", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Expurgate", "pos": "v", "back": "To remove objectionable material from a text before publishing.", "example": "The school library kept an expurgated version of the novel."}, {"id": "v91", "deck": "vocab", "tag": "Top & Common Words", "front": "Extant", "pos": "adj", "back": "Still in existence; not extinct or destroyed.", "example": "Only three copies of the original manuscript are still extant."}, {"id": "v92", "deck": "vocab", "tag": "By the Letter", "front": "Extenuating", "pos": "adj", "back": "Providing a partial excuse by making an offense seem less serious.", "example": "The judge cited extenuating circumstances and reduced the sentence."}, {"id": "v93", "deck": "vocab", "tag": "By the Letter", "front": "Factious", "pos": "adj", "back": "Tending to cause disagreement within a group.", "example": "The factious board split into two camps over the merger."}, {"id": "v94", "deck": "vocab", "tag": "By the Letter", "front": "Factitious", "pos": "adj", "back": "Artificial or fake, rather than natural.", "example": "His outrage felt factitious, more performance than real feeling."}, {"id": "v95", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Fell", "pos": "adj", "back": "Fierce or deadly, in older or literary usage.", "example": "One fell swoop ended three years of careful planning."}, {"id": "v96", "deck": "vocab", "tag": "Themed Vocab", "front": "Ferret", "pos": "v", "back": "To search persistently until something is found.", "example": "It took a week to ferret out the source of the leak."}, {"id": "v97", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Fleece", "pos": "v", "back": "To swindle someone out of money.", "example": "The contractor fleeced the family for repairs that were never needed."}, {"id": "v98", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Flush", "pos": "adj", "back": "Having plenty of something, especially money.", "example": "After the bonus, they finally felt flush enough to travel."}, {"id": "v99", "deck": "vocab", "tag": "By the Letter", "front": "Fractious", "pos": "adj", "back": "Irritable and difficult to control.", "example": "The fractious toddler refused to nap on the long flight."}, {"id": "v100", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Frugal", "pos": "adj", "back": "Careful and sparing with money, without being stingy.", "example": "Their frugal habits let them retire a decade early."}, {"id": "v101", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Galvanize", "pos": "v", "back": "To shock or excite someone into action.", "example": "The petition galvanized hundreds of students to show up at city hall."}, {"id": "v102", "deck": "vocab", "tag": "Word Origins", "front": "Gerrymander", "pos": "v", "back": "To redraw political boundaries to favor one party.", "example": "The new map was widely criticized as an attempt to gerrymander the district."}, {"id": "v103", "deck": "vocab", "tag": "Themed Vocab", "front": "Goosebumps", "pos": "n", "back": "Small bumps on skin caused by cold, fear, or excitement.", "example": "The final note of the song gave the whole audience goosebumps."}, {"id": "v104", "deck": "vocab", "tag": "Themed Vocab", "front": "Gregarious", "pos": "adj", "back": "Fond of company; sociable.", "example": "Her gregarious personality made her the obvious host for every party."}, {"id": "v105", "deck": "vocab", "tag": "Themed Vocab", "front": "Harangue", "pos": "n/v", "back": "A long, forceful speech, especially one criticizing someone.", "example": "He launched into a harangue about the parking situation."}, {"id": "v106", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Hedge", "pos": "n/v", "back": "To protect against loss by avoiding a firm commitment.", "example": "She hedged her answer, unwilling to commit to either plan."}, {"id": "v107", "deck": "vocab", "tag": "Themed Vocab", "front": "Heyday", "pos": "n", "back": "The period of greatest success or popularity.", "example": "In its heyday, the mill employed half the town."}, {"id": "v108", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "History", "pos": "n", "back": "The study of past events.", "example": "She majored in history before switching to public policy."}, {"id": "v109", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Histrionic", "pos": "adj", "back": "Overly theatrical or dramatic.", "example": "His histrionic reaction to the delay embarrassed everyone at the gate."}, {"id": "v110", "deck": "vocab", "tag": "Themed Vocab", "front": "Hodgepodge", "pos": "n", "back": "A confused mixture of things.", "example": "The playlist was a hodgepodge of genres with no clear theme."}, {"id": "v111", "deck": "vocab", "tag": "Themed Vocab", "front": "Hound", "pos": "v", "back": "To pursue relentlessly.", "example": "Reporters hounded the senator for a comment on the scandal."}, {"id": "v112", "deck": "vocab", "tag": "Themed Vocab", "front": "Iconoclast", "pos": "n", "back": "A person who challenges established beliefs or traditions.", "example": "The architect was an iconoclast, rejecting every convention of the era."}, {"id": "v113", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Imbibe", "pos": "v", "back": "To drink, or figuratively to absorb ideas.", "example": "He imbibed his mentor's philosophy long before he understood it fully."}, {"id": "v114", "deck": "vocab", "tag": "Word Origins", "front": "Imbroglio", "pos": "n", "back": "A confusing and embarrassing situation.", "example": "The merger turned into a legal imbroglio that lasted years."}, {"id": "v115", "deck": "vocab", "tag": "High Difficulty", "front": "Immaterial", "pos": "adj", "back": "Not relevant or important to the matter at hand.", "example": "The judge ruled the witness's opinion immaterial to the case."}, {"id": "v116", "deck": "vocab", "tag": "Money & Finance", "front": "Impecunious", "pos": "adj", "back": "Having little or no money.", "example": "The impecunious artist survived on ramen and student loans."}, {"id": "v117", "deck": "vocab", "tag": "High Difficulty", "front": "Impertinent", "pos": "adj", "back": "Rude and not showing proper respect.", "example": "The intern's impertinent question caught the CEO off guard."}, {"id": "v118", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Imponderable", "pos": "adj/n", "back": "Impossible to estimate or evaluate with certainty.", "example": "How the market would react was an imponderable no model could predict."}, {"id": "v119", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Indigenous", "pos": "adj", "back": "Native to a particular place.", "example": "The exhibit focused on plants indigenous to the region."}, {"id": "v120", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Indigent", "pos": "adj", "back": "Extremely poor.", "example": "The clinic offered free care to indigent patients."}, {"id": "v121", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Indignant", "pos": "adj", "back": "Feeling angry because of perceived unfair treatment.", "example": "She grew indignant when the waiter assumed she couldn't pay."}, {"id": "v122", "deck": "vocab", "tag": "High Difficulty", "front": "Inflammable", "pos": "adj", "back": "Easily set on fire. Means the same as flammable, not its opposite.", "example": "The warning label marked the solvent as inflammable."}, {"id": "v123", "deck": "vocab", "tag": "Themed Vocab", "front": "Ingenuous", "pos": "adj", "back": "Innocent and unsuspecting; sincere.", "example": "His ingenuous questions revealed he had no idea how competitive the field was."}, {"id": "v124", "deck": "vocab", "tag": "Top & Common Words", "front": "Innocuous", "pos": "adj", "back": "Not harmful or offensive.", "example": "The comment seemed innocuous, but it started an office wide argument."}, {"id": "v125", "deck": "vocab", "tag": "Money & Finance", "front": "Insolvent", "pos": "adj", "back": "Unable to pay one's debts.", "example": "The airline declared itself insolvent after two brutal years of losses."}, {"id": "v126", "deck": "vocab", "tag": "High Difficulty", "front": "Insufferable", "pos": "adj", "back": "Unbearably arrogant or tedious.", "example": "He became insufferable the moment he made partner."}, {"id": "v127", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Intimate", "pos": "adj/v", "back": "To hint or suggest indirectly; also, closely familiar.", "example": "She intimated that layoffs were coming without saying so outright."}, {"id": "v128", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Inundate", "pos": "v", "back": "To overwhelm with a large amount of something.", "example": "The office was inundated with applications within a day of posting."}, {"id": "v129", "deck": "vocab", "tag": "Themed Vocab", "front": "Invective", "pos": "n", "back": "Harsh, abusive language.", "example": "The comment section filled with invective within minutes."}, {"id": "v130", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Involved", "pos": "adj", "back": "Complicated or intricate.", "example": "Filing the claim turned out to be a far more involved process than expected."}, {"id": "v131", "deck": "vocab", "tag": "Themed Vocab", "front": "Jaundice", "pos": "adj/n", "back": "A yellowish discoloration; the adjective jaundiced means bitter and cynical.", "example": "Years of bad bosses left him with a jaundiced view of management."}, {"id": "v132", "deck": "vocab", "tag": "Themed Vocab", "front": "Jejune", "pos": "adj", "back": "Naive, simplistic, or intellectually shallow.", "example": "The critic dismissed the script's twist as jejune."}, {"id": "v133", "deck": "vocab", "tag": "Themed Vocab", "front": "Jingoist", "pos": "adj", "back": "Extremely and aggressively patriotic.", "example": "The jingoist rhetoric drowned out any real policy discussion."}, {"id": "v134", "deck": "vocab", "tag": "Word Origins", "front": "Junta", "pos": "n", "back": "A group, especially military, that rules a country after seizing power.", "example": "The junta suspended the constitution within days of the coup."}, {"id": "v135", "deck": "vocab", "tag": "Word Origins", "front": "Kafkaesque", "pos": "adj", "back": "Nightmarishly complex, illogical, or bureaucratic.", "example": "Renewing the visa turned into a Kafkaesque ordeal of forms and offices."}, {"id": "v136", "deck": "vocab", "tag": "Word Origins", "front": "Kowtow", "pos": "v", "back": "To act in an excessively submissive or deferential way.", "example": "He refused to kowtow to the board's every demand."}, {"id": "v137", "deck": "vocab", "tag": "Top & Common Words", "front": "Laconic", "pos": "adj", "back": "Using very few words; terse.", "example": "The general's laconic reply was just two words: not yet."}, {"id": "v138", "deck": "vocab", "tag": "Word Origins", "front": "Lagniappe", "pos": "n", "back": "A small unexpected gift or extra bonus.", "example": "The waiter brought a slice of cake as lagniappe for the anniversary."}, {"id": "v139", "deck": "vocab", "tag": "Themed Vocab", "front": "Lascivious", "pos": "adj", "back": "Showing excessive sexual desire in an inappropriate way.", "example": "His lascivious comments got him reported to HR."}, {"id": "v140", "deck": "vocab", "tag": "High Difficulty", "front": "Limpid", "pos": "adj", "back": "Clear and transparent, often describing water or prose.", "example": "Her limpid prose made even dense science easy to follow."}, {"id": "v141", "deck": "vocab", "tag": "Themed Vocab", "front": "Macabre", "pos": "adj", "back": "Disturbing because concerned with death.", "example": "The museum's macabre exhibit on Victorian mourning drew huge crowds."}, {"id": "v142", "deck": "vocab", "tag": "Top & Common Words", "front": "Maintain", "pos": "v", "back": "To assert something as true, or to keep something in existence.", "example": "The scientist maintained that the results would replicate."}, {"id": "v143", "deck": "vocab", "tag": "Word Origins", "front": "Malapropism", "pos": "n", "back": "The mistaken use of a word in place of a similar sounding one, for comic effect.", "example": "His malapropism, 'for all intensive purposes,' made the whole room laugh."}, {"id": "v144", "deck": "vocab", "tag": "Themed Vocab", "front": "Malfeasance", "pos": "n", "back": "Wrongdoing, especially by a public official.", "example": "The audit uncovered years of financial malfeasance."}, {"id": "v145", "deck": "vocab", "tag": "Themed Vocab", "front": "Martinet", "pos": "n", "back": "A strict disciplinarian who demands rigid obedience.", "example": "The new sergeant was a martinet who inspected every bunk each morning."}, {"id": "v146", "deck": "vocab", "tag": "Word Origins", "front": "Maudlin", "pos": "adj", "back": "Excessively and sentimentally emotional.", "example": "After a few drinks, he got maudlin about his college years."}, {"id": "v147", "deck": "vocab", "tag": "Themed Vocab", "front": "Mellifluous", "pos": "adj", "back": "Sweet and smooth sounding.", "example": "Her mellifluous voice made even the safety announcement pleasant to hear."}, {"id": "v148", "deck": "vocab", "tag": "Word Origins", "front": "Mercurial", "pos": "adj", "back": "Subject to sudden, unpredictable changes in mood.", "example": "The chef's mercurial temper kept the whole kitchen on edge."}, {"id": "v149", "deck": "vocab", "tag": "Word Origins", "front": "Mesmerize", "pos": "v", "back": "To hold someone's complete attention, as if hypnotized.", "example": "The dancer's footwork mesmerized the entire theater."}, {"id": "v150", "deck": "vocab", "tag": "Themed Vocab", "front": "Mettlesome", "pos": "adj", "back": "Full of courage and spirit.", "example": "The mettlesome young horse fought the bridle from the start."}, {"id": "v151", "deck": "vocab", "tag": "Themed Vocab", "front": "Misanthrope", "pos": "n", "back": "A person who dislikes people in general.", "example": "The old misanthrope kept his blinds shut and his doorbell disconnected."}, {"id": "v152", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Miserly", "pos": "adj", "back": "Stingy; unwilling to spend money.", "example": "The miserly landlord refused to fix the heater for months."}, {"id": "v153", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Moment", "pos": "n", "back": "A point in time; also, importance or significance.", "example": "The treaty was a decision of great moment for the region."}, {"id": "v154", "deck": "vocab", "tag": "Money & Finance", "front": "Mulct", "pos": "v", "back": "To extract money from someone by fine or fraud.", "example": "The scheme mulcted thousands of small investors out of their savings."}, {"id": "v155", "deck": "vocab", "tag": "Word Origins", "front": "Nabob", "pos": "n", "back": "A person of great wealth or importance.", "example": "Local nabobs funded most of the new museum wing."}, {"id": "v156", "deck": "vocab", "tag": "Themed Vocab", "front": "Nadir", "pos": "n", "back": "The lowest point of something.", "example": "Losing the championship game marked the nadir of the season."}, {"id": "v157", "deck": "vocab", "tag": "Themed Vocab", "front": "Overweening", "pos": "adj", "back": "Excessively arrogant or overconfident.", "example": "His overweening confidence blinded him to every warning sign."}, {"id": "v158", "deck": "vocab", "tag": "Themed Vocab", "front": "Palimpsest", "pos": "n", "back": "Something reused or altered but still bearing traces of its earlier form.", "example": "The old city felt like a palimpsest, Roman walls under Ottoman streets under modern shops."}, {"id": "v159", "deck": "vocab", "tag": "Word Origins", "front": "Panglossian", "pos": "adj", "back": "Excessively optimistic, especially in the face of hardship.", "example": "His Panglossian outlook survived even the company's third layoff round."}, {"id": "v160", "deck": "vocab", "tag": "Word Origins", "front": "Pariah", "pos": "n", "back": "An outcast, someone rejected by a group.", "example": "After the scandal broke, he became a pariah at every industry conference."}, {"id": "v161", "deck": "vocab", "tag": "Themed Vocab", "front": "Parochial", "pos": "adj", "back": "Having a narrow, limited outlook, especially about local matters.", "example": "The committee's parochial focus ignored how other countries handled the same problem."}, {"id": "v162", "deck": "vocab", "tag": "Money & Finance", "front": "Parsimonious", "pos": "adj", "back": "Extremely unwilling to spend money; stingy.", "example": "The parsimonious budget left almost nothing for repairs."}, {"id": "v163", "deck": "vocab", "tag": "Word Origins", "front": "Parvenu", "pos": "n", "back": "A person who has recently risen in social or economic status, often viewed with disdain.", "example": "The old families dismissed him as a parvenu, no matter how much he donated."}, {"id": "v164", "deck": "vocab", "tag": "Top & Common Words", "front": "Paucity", "pos": "n", "back": "A scarcity or lack of something.", "example": "The report cited a paucity of evidence for the claim."}, {"id": "v165", "deck": "vocab", "tag": "Money & Finance", "front": "Penurious", "pos": "adj", "back": "Extremely poor, or excessively stingy.", "example": "He lived a penurious life despite the fortune sitting in his accounts."}, {"id": "v166", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Peremptory", "pos": "adj", "back": "Commanding, allowing no argument or refusal.", "example": "Her peremptory tone made it clear the decision was already made."}, {"id": "v167", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Perfunctory", "pos": "adj", "back": "Done as a routine, without real interest or effort.", "example": "He gave the report a perfunctory glance before signing it."}, {"id": "v168", "deck": "vocab", "tag": "Themed Vocab", "front": "Peruse", "pos": "v", "back": "To read or examine carefully. Does not mean to skim.", "example": "She perused the contract line by line before signing."}, {"id": "v169", "deck": "vocab", "tag": "Themed Vocab", "front": "Phantasmagorical", "pos": "adj", "back": "Having a fantastic or dreamlike quality.", "example": "The parade's floats had a phantasmagorical, almost surreal quality."}, {"id": "v170", "deck": "vocab", "tag": "Word Origins", "front": "Picayune", "pos": "adj", "back": "Of little value or importance; petty.", "example": "The board spent an hour on a picayune detail about the letterhead."}, {"id": "v171", "deck": "vocab", "tag": "Themed Vocab", "front": "Pinnacle", "pos": "n", "back": "The highest point of achievement.", "example": "Winning the Nobel marked the pinnacle of her career."}, {"id": "v172", "deck": "vocab", "tag": "Word Origins", "front": "Pollyannaish", "pos": "adj", "back": "Excessively or foolishly optimistic.", "example": "His Pollyannaish forecast ignored every risk the analysts flagged."}, {"id": "v173", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Ponderous", "pos": "adj", "back": "Slow, heavy, and labored, often describing writing or movement.", "example": "The ponderous opening chapter almost made her put the book down."}, {"id": "v174", "deck": "vocab", "tag": "Word Origins", "front": "Powwow", "pos": "n/v", "back": "An informal meeting or discussion.", "example": "The coaches had a quick powwow before sending in the new play."}, {"id": "v175", "deck": "vocab", "tag": "Themed Vocab", "front": "Precipitate", "pos": "adj/n/v", "back": "To cause something to happen suddenly; also, hasty and rash.", "example": "The resignation precipitated a scramble to find a replacement."}, {"id": "v176", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Preemptive", "pos": "adj", "back": "Done in advance to prevent something from happening.", "example": "The company issued a preemptive apology before the story even broke."}, {"id": "v177", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Prevaricate", "pos": "v", "back": "To speak evasively or avoid telling the truth directly.", "example": "The senator prevaricated for ten minutes without ever answering the question."}, {"id": "v178", "deck": "vocab", "tag": "Money & Finance", "front": "Prodigal", "pos": "adj", "back": "Wastefully extravagant with money or resources.", "example": "The prodigal heir burned through the inheritance in under five years."}, {"id": "v179", "deck": "vocab", "tag": "Money & Finance", "front": "Profligate", "pos": "adj/n", "back": "Recklessly wasteful, especially with money.", "example": "Critics called the stadium deal a profligate use of public funds."}, {"id": "v180", "deck": "vocab", "tag": "Top & Common Words", "front": "Profuse", "pos": "adj", "back": "Plentiful, given or produced in large amounts.", "example": "He offered profuse apologies for showing up an hour late."}, {"id": "v181", "deck": "vocab", "tag": "High Difficulty", "front": "Propitiate", "pos": "v", "back": "To win the favor of, or appease.", "example": "The company offered refunds to propitiate its angriest customers."}, {"id": "v182", "deck": "vocab", "tag": "Top & Common Words", "front": "Prosaic", "pos": "adj", "back": "Dull and unimaginative; ordinary.", "example": "The tour guide's prosaic description made even the ruins sound boring."}, {"id": "v183", "deck": "vocab", "tag": "Word Origins", "front": "Protean", "pos": "adj", "back": "Able to change easily and take on many forms.", "example": "Her protean talent let her move from drama to comedy without missing a beat."}, {"id": "v184", "deck": "vocab", "tag": "Top & Common Words", "front": "Pugnacious", "pos": "adj", "back": "Eager to argue or fight.", "example": "His pugnacious style made every meeting feel like a debate."}, {"id": "v185", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Qualify", "pos": "v", "back": "To limit or restrict a statement's meaning.", "example": "She qualified her praise by noting the deadline had been generous."}, {"id": "v186", "deck": "vocab", "tag": "Word Origins", "front": "Quisling", "pos": "n", "back": "A traitor who collaborates with an occupying enemy force.", "example": "History remembers him as a quisling who handed the city to the invaders."}, {"id": "v187", "deck": "vocab", "tag": "Word Origins", "front": "Quixotic", "pos": "adj", "back": "Idealistic to an impractical degree.", "example": "His quixotic plan to reform the agency single handedly went nowhere."}, {"id": "v188", "deck": "vocab", "tag": "High Difficulty", "front": "Remiss", "pos": "adj", "back": "Careless in performing one's duty.", "example": "It would be remiss not to mention the risks before signing."}, {"id": "v189", "deck": "vocab", "tag": "High Difficulty", "front": "Remonstrate", "pos": "v", "back": "To argue or plead in protest.", "example": "Residents remonstrated with the council over the new zoning rule."}, {"id": "v190", "deck": "vocab", "tag": "High Difficulty", "front": "Repine", "pos": "v", "back": "To express discontent; to complain or fret.", "example": "He repined for weeks over the job he had turned down."}, {"id": "v191", "deck": "vocab", "tag": "Themed Vocab", "front": "Reprobate", "pos": "n", "back": "A person of low or unprincipled character.", "example": "The old reprobate had been banned from three different bars in town."}, {"id": "v192", "deck": "vocab", "tag": "High Difficulty", "front": "Restive", "pos": "adj", "back": "Restless and impatient, resistant to control.", "example": "The crowd grew restive after the third delayed announcement."}, {"id": "v193", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Retiring", "pos": "adj", "back": "Shy and reserved.", "example": "For someone so retiring, she gave a surprisingly confident speech."}, {"id": "v194", "deck": "vocab", "tag": "Themed Vocab", "front": "Sanctimonious", "pos": "adj", "back": "Making a show of being morally superior.", "example": "His sanctimonious lecture on punctuality came from the one person who was late."}, {"id": "v195", "deck": "vocab", "tag": "Word Origins", "front": "Sangfroid", "pos": "n", "back": "Calmness and composure under pressure.", "example": "She handled the emergency landing with remarkable sangfroid."}, {"id": "v196", "deck": "vocab", "tag": "Themed Vocab", "front": "Sanguine", "pos": "adj", "back": "Optimistic and confident, especially in a difficult situation.", "example": "He stayed sanguine about the deal even after the second delay."}, {"id": "v197", "deck": "vocab", "tag": "Word Origins", "front": "Sartorial", "pos": "adj", "back": "Relating to clothing or style of dress.", "example": "The magazine praised his sartorial choices at the premiere."}, {"id": "v198", "deck": "vocab", "tag": "Word Origins", "front": "Saturnine", "pos": "adj", "back": "Gloomy and slow to show emotion.", "example": "His saturnine expression rarely changed, even at his own retirement party."}, {"id": "v199", "deck": "vocab", "tag": "Word Origins", "front": "Schadenfreude", "pos": "n", "back": "Pleasure derived from another person's misfortune.", "example": "There was a flicker of schadenfreude when the rival team lost in the finals."}, {"id": "v200", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Scintillating", "pos": "adj", "back": "Brilliantly clever or lively.", "example": "The panel's scintillating debate kept the audience engaged for two hours."}, {"id": "v201", "deck": "vocab", "tag": "Themed Vocab", "front": "Screed", "pos": "n", "back": "A long, tedious piece of writing, often a rant.", "example": "He posted a five page screed about the parking policy."}, {"id": "v202", "deck": "vocab", "tag": "Top & Common Words", "front": "Sedulous", "pos": "adj", "back": "Diligent and persistent in effort.", "example": "Her sedulous note taking paid off during finals week."}, {"id": "v203", "deck": "vocab", "tag": "High Difficulty", "front": "Sententious", "pos": "adj", "back": "Given to moralizing in a pompous way.", "example": "The sententious foreword lectured readers before the story even began."}, {"id": "v204", "deck": "vocab", "tag": "Themed Vocab", "front": "Serendipity", "pos": "n", "back": "The occurrence of fortunate events by chance.", "example": "Meeting her old professor at the airport felt like pure serendipity."}, {"id": "v205", "deck": "vocab", "tag": "Themed Vocab", "front": "Slapdash", "pos": "adj", "back": "Done quickly and carelessly.", "example": "The slapdash repair job fell apart within a week."}, {"id": "v206", "deck": "vocab", "tag": "Money & Finance", "front": "Spendthrift", "pos": "n", "back": "A person who spends money recklessly.", "example": "His parents worried he would turn into a spendthrift once he got his first paycheck."}, {"id": "v207", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Start", "pos": "v", "back": "To move suddenly in surprise or alarm.", "example": "She started at the sound of the door slamming shut."}, {"id": "v208", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Stem", "pos": "v", "back": "To stop the flow or spread of something.", "example": "The new policy was meant to stem the rise in complaints."}, {"id": "v209", "deck": "vocab", "tag": "Money & Finance", "front": "Stipend", "pos": "n", "back": "A fixed, regular sum paid as a salary or allowance.", "example": "The fellowship included a modest stipend for living expenses."}, {"id": "v210", "deck": "vocab", "tag": "Themed Vocab", "front": "Summit", "pos": "n", "back": "The highest point; the peak.", "example": "They reached the summit just before the storm rolled in."}, {"id": "v211", "deck": "vocab", "tag": "Word Origins", "front": "Supercilious", "pos": "adj", "back": "Behaving as though superior to others; haughty.", "example": "The supercilious waiter made her feel judged for ordering tap water."}, {"id": "v212", "deck": "vocab", "tag": "Money & Finance", "front": "Sybarite", "pos": "n", "back": "A person devoted to luxury and pleasure.", "example": "The resort catered entirely to sybarites who never left the pool."}, {"id": "v213", "deck": "vocab", "tag": "Themed Vocab", "front": "Syncretic", "pos": "adj", "back": "Combining different beliefs or practices into one.", "example": "The temple's syncretic art blended Buddhist and local folk traditions."}, {"id": "v214", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Telling", "pos": "adj", "back": "Revealing, or having a significant effect.", "example": "His hesitation before answering was pretty telling."}, {"id": "v215", "deck": "vocab", "tag": "Themed Vocab", "front": "Telltale", "pos": "adj", "back": "Revealing something that was meant to be hidden.", "example": "The telltale smell of smoke gave away where he had been."}, {"id": "v216", "deck": "vocab", "tag": "High Difficulty", "front": "Tendentious", "pos": "adj", "back": "Promoting a particular, often controversial, point of view.", "example": "The documentary's tendentious editing left out any opposing view."}, {"id": "v217", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Tender", "pos": "v", "back": "To formally offer or submit, such as a resignation.", "example": "She tendered her resignation the same week the merger closed."}, {"id": "v218", "deck": "vocab", "tag": "Money & Finance", "front": "Thrifty", "pos": "adj", "back": "Careful and economical with money.", "example": "Their thrifty habits let them pay off the mortgage early."}, {"id": "v219", "deck": "vocab", "tag": "Themed Vocab", "front": "Tirade", "pos": "n", "back": "A long, angry speech of criticism.", "example": "He launched into a tirade the moment the flight was delayed."}, {"id": "v220", "deck": "vocab", "tag": "Themed Vocab", "front": "Truculent", "pos": "adj", "back": "Aggressively hostile or defiant.", "example": "The truculent teenager answered every question with a shrug."}, {"id": "v221", "deck": "vocab", "tag": "Themed Vocab", "front": "Turpitude", "pos": "n", "back": "Depraved or shameful behavior.", "example": "The scandal was cited as an act of moral turpitude."}, {"id": "v222", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Unchecked", "pos": "adj", "back": "Not restrained or controlled.", "example": "Left unchecked, the algae bloom spread across the entire lake."}, {"id": "v223", "deck": "vocab", "tag": "High Difficulty", "front": "Unconscionable", "pos": "adj", "back": "Not right or reasonable; shockingly unfair.", "example": "Charging that much for basic repairs was simply unconscionable."}, {"id": "v224", "deck": "vocab", "tag": "High Difficulty", "front": "Undermine", "pos": "v", "back": "To weaken gradually or secretly.", "example": "Constant criticism undermined the team's confidence before the game even started."}, {"id": "v225", "deck": "vocab", "tag": "Themed Vocab", "front": "Underwrite", "pos": "v", "back": "To financially support, or to assume financial responsibility for risk.", "example": "The foundation agreed to underwrite the entire research trip."}, {"id": "v226", "deck": "vocab", "tag": "High Difficulty", "front": "Unnerve", "pos": "v", "back": "To make someone lose courage or confidence.", "example": "The sudden silence in the room unnerved every candidate at once."}, {"id": "v227", "deck": "vocab", "tag": "Themed Vocab", "front": "Untoward", "pos": "adj", "back": "Unexpected and inappropriate or improper.", "example": "Nothing untoward happened during the inspection, to everyone's relief."}, {"id": "v228", "deck": "vocab", "tag": "Themed Vocab", "front": "Upbraid", "pos": "v", "back": "To scold or criticize severely.", "example": "The captain upbraided the crew for the missed signal."}, {"id": "v229", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Variance", "pos": "n", "back": "A difference or discrepancy between two things.", "example": "The audit flagged a variance between reported and actual expenses."}, {"id": "v230", "deck": "vocab", "tag": "By the Letter", "front": "Venal", "pos": "adj", "back": "Easily bribed or corrupted.", "example": "The venal official approved every permit for the right price."}, {"id": "v231", "deck": "vocab", "tag": "Themed Vocab", "front": "Venality", "pos": "n", "back": "The quality of being open to bribery or corruption.", "example": "The report exposed decades of venality in the licensing office."}, {"id": "v232", "deck": "vocab", "tag": "By the Letter", "front": "Venerate", "pos": "v", "back": "To regard with great respect.", "example": "Students still venerate the retired professor decades after her last lecture."}, {"id": "v233", "deck": "vocab", "tag": "By the Letter", "front": "Venial", "pos": "adj", "back": "Minor and easily forgiven, especially of a sin or fault.", "example": "Forgetting to cc a colleague felt like a venial mistake at worst."}, {"id": "v234", "deck": "vocab", "tag": "By the Letter", "front": "Veracious", "pos": "adj", "back": "Habitually truthful.", "example": "A veracious witness, she never wavered under cross examination."}, {"id": "v235", "deck": "vocab", "tag": "By the Letter", "front": "Vicarious", "pos": "adj", "back": "Experienced through the actions or feelings of another.", "example": "He got a vicarious thrill watching his daughter's first race."}, {"id": "v236", "deck": "vocab", "tag": "By the Letter", "front": "Vicissitude", "pos": "n", "back": "A change of circumstances, especially an unwelcome one.", "example": "Despite the vicissitudes of the market, the fund stayed steady."}, {"id": "v237", "deck": "vocab", "tag": "Themed Vocab", "front": "Virago", "pos": "n", "back": "A fierce, domineering woman.", "example": "The play cast her as a virago who terrifies every suitor."}, {"id": "v238", "deck": "vocab", "tag": "Themed Vocab", "front": "Vituperation", "pos": "n", "back": "Bitter and abusive language.", "example": "The review was less criticism than pure vituperation."}, {"id": "v239", "deck": "vocab", "tag": "By the Letter", "front": "Voracious", "pos": "adj", "back": "Having a huge appetite, literal or figurative.", "example": "A voracious reader, she finished three novels a week."}, {"id": "v240", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Wanting", "pos": "adj", "back": "Lacking something necessary; deficient.", "example": "The plan looked solid on paper but was wanting in real detail."}, {"id": "v241", "deck": "vocab", "tag": "Tricky & Confusable Meanings", "front": "Wax", "pos": "n/v", "back": "To grow or increase gradually. The opposite of wane.", "example": "His enthusiasm waxed and waned depending on who was in the room."}, {"id": "v242", "deck": "vocab", "tag": "Word Origins", "front": "Zeitgeist", "pos": "n", "back": "The defining spirit or mood of a particular period.", "example": "The film captured the zeitgeist of a country in the middle of change."}, {"id": "v243", "deck": "vocab", "tag": "Themed Vocab", "front": "Zenith", "pos": "n", "back": "The highest point; the peak.", "example": "The empire's zenith came just a century before its collapse."}, {"id": "m0", "deck": "math", "tag": "Percentages & Ratios", "front": "Percent change formula", "pos": "", "back": "(New − Old) ÷ Old × 100. A positive result means an increase, negative means a decrease.", "example": ""}, {"id": "m1", "deck": "math", "tag": "Percentages & Ratios", "front": "Percent of a percent", "pos": "", "back": "30% of 50% of x = 0.30 × 0.50 × x = 0.15x. Multiply the decimals, don't add them.", "example": ""}, {"id": "m2", "deck": "math", "tag": "Percentages & Ratios", "front": "\"x is what percent of y\"", "pos": "", "back": "(x ÷ y) × 100. Be careful which number is the whole (the denominator).", "example": ""}, {"id": "m3", "deck": "math", "tag": "Percentages & Ratios", "front": "Successive percent changes", "pos": "", "back": "A 20% increase then a 20% decrease is NOT 0%. Multiply the factors: 1.20 × 0.80 = 0.96, a net 4% decrease.", "example": ""}, {"id": "m4", "deck": "math", "tag": "Percentages & Ratios", "front": "Ratio to fraction of the whole", "pos": "", "back": "A ratio a : b splits the whole into (a + b) parts. One part = total ÷ (a + b).", "example": ""}, {"id": "m5", "deck": "math", "tag": "Percentages & Ratios", "front": "Part-to-part vs. part-to-whole", "pos": "", "back": "A ratio of 3 : 5 means 3 parts to 5 parts, so the whole is 8 parts. Each quantity is 3/8 and 5/8 of the total.", "example": ""}, {"id": "m6", "deck": "math", "tag": "Percentages & Ratios", "front": "Scaling a ratio", "pos": "", "back": "A ratio keeps the same value when both sides are multiplied by the same number: 2 : 3 = 4 : 6 = 20 : 30.", "example": ""}, {"id": "m7", "deck": "math", "tag": "Percentages & Ratios", "front": "Percent increase to reach a target", "pos": "", "back": "To go from x to y: percent increase = (y − x) ÷ x × 100. Always divide by the STARTING value.", "example": ""}, {"id": "m8", "deck": "math", "tag": "Percentages & Ratios", "front": "Weighted average shortcut", "pos": "", "back": "A weighted average sits closer to the value with more weight. Three tests averaging 80 plus one test of 100 pulls the overall average only slightly above 80.", "example": ""}, {"id": "m9", "deck": "math", "tag": "Exponents & Roots", "front": "Multiplying same base", "pos": "", "back": "a^m × a^n = a^(m+n). Add the exponents when multiplying.", "example": ""}, {"id": "m10", "deck": "math", "tag": "Exponents & Roots", "front": "Dividing same base", "pos": "", "back": "a^m ÷ a^n = a^(m−n). Subtract exponents when dividing.", "example": ""}, {"id": "m11", "deck": "math", "tag": "Exponents & Roots", "front": "Power of a power", "pos": "", "back": "(a^m)^n = a^(mn). Multiply the exponents.", "example": ""}, {"id": "m12", "deck": "math", "tag": "Exponents & Roots", "front": "Negative exponent", "pos": "", "back": "a^(−n) = 1 ÷ a^n. A negative exponent flips to a fraction, it does not make the value negative.", "example": ""}, {"id": "m13", "deck": "math", "tag": "Exponents & Roots", "front": "Zero exponent", "pos": "", "back": "Any nonzero number raised to the 0 power equals 1. a^0 = 1.", "example": ""}, {"id": "m14", "deck": "math", "tag": "Exponents & Roots", "front": "Fractional exponent", "pos": "", "back": "a^(1/n) is the nth root of a. a^(m/n) is the nth root of a, raised to the m power.", "example": ""}, {"id": "m15", "deck": "math", "tag": "Exponents & Roots", "front": "Adding exponential terms, same base", "pos": "", "back": "You can't add exponents directly. 2^3 + 2^3 = 2 × 2^3 = 2^4, not 2^6. Factor out the common term first.", "example": ""}, {"id": "m16", "deck": "math", "tag": "Exponents & Roots", "front": "Square root of a product", "pos": "", "back": "√(ab) = √a × √b, but √(a+b) ≠ √a + √b. Roots distribute over multiplication, not addition.", "example": ""}, {"id": "m17", "deck": "math", "tag": "Exponents & Roots", "front": "Perfect squares to memorize", "pos": "", "back": "1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225. Knowing these speeds up simplifying roots.", "example": ""}, {"id": "m18", "deck": "math", "tag": "Algebra Shortcuts", "front": "Difference of squares", "pos": "", "back": "a² − b² = (a + b)(a − b). One of the most common GRE factoring patterns.", "example": ""}, {"id": "m19", "deck": "math", "tag": "Algebra Shortcuts", "front": "Perfect square trinomial", "pos": "", "back": "a² + 2ab + b² = (a + b)². Recognize this pattern to factor instantly.", "example": ""}, {"id": "m20", "deck": "math", "tag": "Algebra Shortcuts", "front": "FOIL", "pos": "", "back": "(a + b)(c + d) = ac + ad + bc + bd. First, Outer, Inner, Last.", "example": ""}, {"id": "m21", "deck": "math", "tag": "Algebra Shortcuts", "front": "Flipping inequality signs", "pos": "", "back": "Multiplying or dividing both sides of an inequality by a negative number flips the inequality sign.", "example": ""}, {"id": "m22", "deck": "math", "tag": "Algebra Shortcuts", "front": "Absolute value equations", "pos": "", "back": "|x| = a means x = a OR x = −a (for a ≥ 0). Always split into two cases.", "example": ""}, {"id": "m23", "deck": "math", "tag": "Algebra Shortcuts", "front": "Absolute value inequalities", "pos": "", "back": "|x| < a means −a < x < a. |x| > a means x < −a OR x > a.", "example": ""}, {"id": "m24", "deck": "math", "tag": "Algebra Shortcuts", "front": "Systems with no unique solution", "pos": "", "back": "If one equation in a system is just a multiple of the other, there is no single unique solution, just infinitely many.", "example": ""}, {"id": "m25", "deck": "math", "tag": "Algebra Shortcuts", "front": "Plugging in numbers for variables", "pos": "", "back": "When a question uses only variables, plug in simple numbers (like 2 and 3) to test the answer choices.", "example": ""}, {"id": "m26", "deck": "math", "tag": "Algebra Shortcuts", "front": "Backsolving from answer choices", "pos": "", "back": "For \"solve for x\" questions, start with the middle answer choice and plug it back into the original equation.", "example": ""}, {"id": "m27", "deck": "math", "tag": "Number Properties", "front": "Even/odd rules", "pos": "", "back": "Even + Even = Even. Odd + Odd = Even. Even + Odd = Odd. Even × anything = Even. Odd × Odd = Odd.", "example": ""}, {"id": "m28", "deck": "math", "tag": "Number Properties", "front": "Prime numbers", "pos": "", "back": "A prime has exactly two factors: 1 and itself. 2 is the only even prime. 1 is not prime.", "example": ""}, {"id": "m29", "deck": "math", "tag": "Number Properties", "front": "Divisibility by 3", "pos": "", "back": "A number is divisible by 3 if the sum of its digits is a multiple of 3.", "example": ""}, {"id": "m30", "deck": "math", "tag": "Number Properties", "front": "Divisibility by 4", "pos": "", "back": "A number is divisible by 4 if its last two digits form a number divisible by 4.", "example": ""}, {"id": "m31", "deck": "math", "tag": "Number Properties", "front": "Divisibility by 9", "pos": "", "back": "A number is divisible by 9 if the sum of its digits is a multiple of 9.", "example": ""}, {"id": "m32", "deck": "math", "tag": "Number Properties", "front": "Remainders", "pos": "", "back": "If a ÷ b leaves remainder r, then a = bq + r, where 0 ≤ r < b.", "example": ""}, {"id": "m33", "deck": "math", "tag": "Number Properties", "front": "Consecutive integers and divisibility", "pos": "", "back": "The sum of n consecutive integers is always divisible by n when n is odd. Not guaranteed when n is even.", "example": ""}, {"id": "m34", "deck": "math", "tag": "Number Properties", "front": "Factors vs. multiples", "pos": "", "back": "Factors of 12 divide evenly into it (1, 2, 3, 4, 6, 12). Multiples of 12 are what 12 divides into (12, 24, 36...).", "example": ""}, {"id": "m35", "deck": "math", "tag": "Number Properties", "front": "GCF and LCM shortcut", "pos": "", "back": "GCF × LCM of two numbers equals the product of the two numbers.", "example": ""}, {"id": "m36", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Triangle angle sum", "pos": "", "back": "The interior angles of any triangle always sum to 180°.", "example": ""}, {"id": "m37", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Triangle inequality", "pos": "", "back": "The sum of any two sides of a triangle must be greater than the third side.", "example": ""}, {"id": "m38", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Exterior angle theorem", "pos": "", "back": "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles.", "example": ""}, {"id": "m39", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Pythagorean theorem", "pos": "", "back": "a² + b² = c², where c is the hypotenuse of a right triangle.", "example": ""}, {"id": "m40", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "3-4-5 and 5-12-13 triangles", "pos": "", "back": "Common right triangle ratios worth memorizing so you can skip the Pythagorean theorem entirely.", "example": ""}, {"id": "m41", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "45-45-90 triangle sides", "pos": "", "back": "Sides are in the ratio x : x : x√2. The hypotenuse equals a leg times √2.", "example": ""}, {"id": "m42", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "30-60-90 triangle sides", "pos": "", "back": "Sides are in the ratio x : x√3 : 2x, opposite the 30°, 60°, and 90° angles respectively.", "example": ""}, {"id": "m43", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Similar triangles", "pos": "", "back": "Corresponding angles are equal and corresponding sides are proportional. Set up a ratio to solve for a missing side.", "example": ""}, {"id": "m44", "deck": "math", "tag": "Geometry: Triangles & Angles", "front": "Sum of interior angles of a polygon", "pos": "", "back": "(n − 2) × 180°, where n is the number of sides.", "example": ""}, {"id": "m45", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Circle circumference", "pos": "", "back": "C = 2πr = πd.", "example": ""}, {"id": "m46", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Circle area", "pos": "", "back": "A = πr².", "example": ""}, {"id": "m47", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Arc length", "pos": "", "back": "Arc length = (central angle ÷ 360°) × circumference.", "example": ""}, {"id": "m48", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Sector area", "pos": "", "back": "Sector area = (central angle ÷ 360°) × πr².", "example": ""}, {"id": "m49", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Rectangle & triangle area", "pos": "", "back": "Rectangle: length × width. Triangle: ½ × base × height.", "example": ""}, {"id": "m50", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Trapezoid area", "pos": "", "back": "½ × (base1 + base2) × height.", "example": ""}, {"id": "m51", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Volume of a rectangular box", "pos": "", "back": "length × width × height.", "example": ""}, {"id": "m52", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Volume of a cylinder", "pos": "", "back": "πr² × height.", "example": ""}, {"id": "m53", "deck": "math", "tag": "Geometry: Circles, Area & Volume", "front": "Surface area of a rectangular box", "pos": "", "back": "2(lw + lh + wh). Add up all six faces in matching pairs.", "example": ""}, {"id": "m54", "deck": "math", "tag": "Statistics & Probability", "front": "Mean", "pos": "", "back": "Sum of all values ÷ number of values.", "example": ""}, {"id": "m55", "deck": "math", "tag": "Statistics & Probability", "front": "Median", "pos": "", "back": "The middle value when data is ordered. For an even count, average the two middle values.", "example": ""}, {"id": "m56", "deck": "math", "tag": "Statistics & Probability", "front": "Mode", "pos": "", "back": "The value that appears most often. A data set can have more than one mode.", "example": ""}, {"id": "m57", "deck": "math", "tag": "Statistics & Probability", "front": "Range", "pos": "", "back": "Highest value minus lowest value.", "example": ""}, {"id": "m58", "deck": "math", "tag": "Statistics & Probability", "front": "Standard deviation, intuition", "pos": "", "back": "Measures how spread out data is from the mean. A tighter cluster means a smaller standard deviation.", "example": ""}, {"id": "m59", "deck": "math", "tag": "Statistics & Probability", "front": "Basic probability", "pos": "", "back": "Probability = favorable outcomes ÷ total possible outcomes.", "example": ""}, {"id": "m60", "deck": "math", "tag": "Statistics & Probability", "front": "Probability of independent events (AND)", "pos": "", "back": "Multiply the individual probabilities: P(A and B) = P(A) × P(B).", "example": ""}, {"id": "m61", "deck": "math", "tag": "Statistics & Probability", "front": "Probability of either event (OR)", "pos": "", "back": "P(A or B) = P(A) + P(B) − P(A and B). Subtract the overlap so you don't double count.", "example": ""}, {"id": "m62", "deck": "math", "tag": "Statistics & Probability", "front": "Combinations vs. permutations", "pos": "", "back": "Order matters: permutation (nPr). Order doesn't matter: combination (nCr). Combinations are always smaller or equal.", "example": ""}, {"id": "m63", "deck": "math", "tag": "Word Problem Strategies", "front": "Work rate problems", "pos": "", "back": "Rate = 1 job ÷ time. Combined rate = sum of individual rates. Combined time = 1 ÷ combined rate.", "example": ""}, {"id": "m64", "deck": "math", "tag": "Word Problem Strategies", "front": "Distance, rate, and time", "pos": "", "back": "Distance = Rate × Time. Rearrange for the others: Rate = D/T, Time = D/R.", "example": ""}, {"id": "m65", "deck": "math", "tag": "Word Problem Strategies", "front": "Average speed for a round trip", "pos": "", "back": "Average speed is NOT the average of the two speeds. Use total distance ÷ total time.", "example": ""}, {"id": "m66", "deck": "math", "tag": "Word Problem Strategies", "front": "Mixture problems", "pos": "", "back": "Set up: (amount1 × concentration1) + (amount2 × concentration2) = total amount × final concentration.", "example": ""}, {"id": "m67", "deck": "math", "tag": "Word Problem Strategies", "front": "Simple interest", "pos": "", "back": "Interest = Principal × Rate × Time.", "example": ""}, {"id": "m68", "deck": "math", "tag": "Word Problem Strategies", "front": "Compound interest", "pos": "", "back": "Final amount = Principal × (1 + rate/n)^(n × time), where n is the number of compounding periods per year.", "example": ""}, {"id": "m69", "deck": "math", "tag": "Word Problem Strategies", "front": "Translating \"of\" and \"is\"", "pos": "", "back": "\"Of\" usually means multiply. \"Is\" usually means equals. \"What\" is your variable.", "example": ""}, {"id": "m70", "deck": "math", "tag": "Word Problem Strategies", "front": "Picking smart numbers", "pos": "", "back": "For percent and ratio word problems with an unknown total, plug in 100 to make the arithmetic easy.", "example": ""}, {"id": "m71", "deck": "math", "tag": "Word Problem Strategies", "front": "Overlapping sets (two groups)", "pos": "", "back": "Total = Group A + Group B − Both + Neither. Sketch a Venn diagram whenever two categories overlap.", "example": ""}];

const BOX_INTERVAL_DAYS = [0, 0, 1, 3, 7, 16]; // index = box (1..5)
const DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_CAP = 20;

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getCardProg(progress, id) {
  return progress[id] || { box: 1, nextReview: 0, seen: 0, correct: 0 };
}

function isDue(prog) {
  return !prog || prog.nextReview <= Date.now();
}

function nextReviewTime(box) {
  const days = BOX_INTERVAL_DAYS[box] ?? 16;
  return Date.now() + days * DAY_MS;
}

async function loadKey(key, fallback) {
  try {
    const raw = localStorage.getItem("studyDrawer:" + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

async function saveKey(key, value) {
  try {
    localStorage.setItem("studyDrawer:" + key, JSON.stringify(value));
  } catch (e) {
    // best effort, ignore
  }
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..900&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.sd-root {
  --paper: #F2ECDD;
  --card: #FDFBF3;
  --rule-blue: #C3D2E7;
  --rule-red: #B5473F;
  --ink: #23273A;
  --ink-soft: #666C82;
  --navy: #24466B;
  --burgundy: #7D2E38;
  --teal: #276458;
  --mustard: #B8862E;
  --good: #3E7D56;
  --good-soft: #E7F1EA;
  --hard: #A1483A;
  --hard-soft: #F5E7E2;
  --border: #DED2AF;
  --shadow: rgba(35, 39, 58, 0.18);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--ink);
  background: var(--paper);
  min-height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 16px 48px;
  background-image:
    radial-gradient(ellipse at top left, rgba(184,134,46,0.06), transparent 55%),
    radial-gradient(ellipse at bottom right, rgba(39,100,88,0.05), transparent 55%);
}
.sd-root * { box-sizing: border-box; }
.sd-serif { font-family: 'Fraunces', Georgia, serif; }
.sd-mono { font-family: 'IBM Plex Mono', monospace; }

.sd-wrap { max-width: 720px; margin: 0 auto; }

.sd-topbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 22px;
}
.sd-brand { display: flex; align-items: baseline; gap: 8px; }
.sd-brand-title {
  font-size: 22px; font-weight: 700; letter-spacing: -0.01em; color: var(--navy);
}
.sd-brand-sub { font-size: 12px; color: var(--ink-soft); font-style: italic; }
.sd-topbar-right { display: flex; align-items: center; gap: 10px; }
.sd-pill {
  display: flex; align-items: center; gap: 5px;
  background: var(--card); border: 1px solid var(--border);
  border-radius: 999px; padding: 5px 11px; font-size: 12.5px;
  font-family: 'IBM Plex Mono', monospace; color: var(--ink);
  box-shadow: 0 1px 2px var(--shadow);
}
.sd-icon-btn {
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; border-radius: 999px;
  background: var(--card); border: 1px solid var(--border);
  color: var(--ink-soft); cursor: pointer;
}
.sd-icon-btn:hover { color: var(--ink); }

.sd-heading { font-size: 30px; font-weight: 600; margin: 6px 0 4px; color: var(--ink); }
.sd-subtext { font-size: 14.5px; color: var(--ink-soft); margin-bottom: 22px; }

.sd-decks { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 16px; }
.sd-deck-card {
  flex: 1 1 220px; background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 18px; cursor: pointer;
  box-shadow: 0 2px 6px var(--shadow); transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative; overflow: hidden;
}
.sd-deck-card:hover { transform: translateY(-2px); box-shadow: 0 6px 14px var(--shadow); }
.sd-deck-card.active { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent) inset, 0 6px 14px var(--shadow); }
.sd-deck-card.vocab { --accent: var(--burgundy); }
.sd-deck-card.math { --accent: var(--teal); }
.sd-deck-card.all { --accent: var(--mustard); }
.sd-deck-icon {
  width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
  background: var(--accent); color: #fff; margin-bottom: 10px;
}
.sd-deck-name { font-family: 'Fraunces', serif; font-weight: 600; font-size: 19px; margin-bottom: 2px; }
.sd-deck-meta { font-size: 12.5px; color: var(--ink-soft); margin-bottom: 10px; }
.sd-deck-stats { display: flex; gap: 8px; flex-wrap: wrap; }
.sd-stat-chip {
  font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; padding: 3px 8px;
  border-radius: 999px; background: rgba(0,0,0,0.04); color: var(--ink-soft);
}
.sd-stat-chip.due { background: var(--accent); color: #fff; }

.sd-panel {
  background: var(--card); border: 1px solid var(--border); border-radius: 14px;
  padding: 18px 18px 20px; margin-bottom: 16px; box-shadow: 0 2px 6px var(--shadow);
}
.sd-panel-title { font-size: 13px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink-soft); margin-bottom: 10px; font-weight: 600; }
.sd-tags { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 16px; }
.sd-tag-chip {
  font-size: 12.5px; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--border);
  background: #fff; color: var(--ink-soft); cursor: pointer; user-select: none;
}
.sd-tag-chip.selected { background: var(--ink); color: #fff; border-color: var(--ink); }

.sd-start-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.sd-btn {
  font-family: 'Inter', sans-serif; font-weight: 600; font-size: 14.5px;
  padding: 11px 20px; border-radius: 10px; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 7px;
}
.sd-btn-primary { background: var(--ink); color: #fff; }
.sd-btn-primary:hover { background: #000; }
.sd-btn-secondary { background: transparent; color: var(--ink-soft); border: 1px solid var(--border); }
.sd-btn-secondary:hover { color: var(--ink); }
.sd-btn-good { background: var(--good); color: #fff; }
.sd-btn-hard { background: #fff; color: var(--hard); border: 1.5px solid var(--hard); }
.sd-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.sd-btn-sm { padding: 7px 13px; font-size: 13px; }

.sd-link-btn { background: none; border: none; color: var(--ink-soft); font-size: 13.5px; cursor: pointer; text-decoration: underline; padding: 0; }
.sd-link-btn:hover { color: var(--ink); }

.sd-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
.sd-field { display: flex; flex-direction: column; gap: 4px; }
.sd-field label { font-size: 12px; color: var(--ink-soft); font-weight: 600; }
.sd-field input, .sd-field select, .sd-field textarea {
  font-family: 'Inter', sans-serif; font-size: 14px; padding: 8px 10px;
  border: 1px solid var(--border); border-radius: 8px; background: #fff; color: var(--ink);
}
.sd-field textarea { resize: vertical; min-height: 44px; }
.sd-field.full { grid-column: 1 / -1; }

.sd-custom-list { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; }
.sd-custom-row {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; padding: 7px 10px; background: #fff; border: 1px solid var(--border); border-radius: 8px;
}
.sd-custom-row-text { color: var(--ink); }
.sd-custom-row-text b { font-family: 'Fraunces', serif; }
.sd-del-btn { background: none; border: none; color: var(--ink-soft); cursor: pointer; display: flex; }
.sd-del-btn:hover { color: var(--hard); }

/* Study screen */
.sd-study-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.sd-progress-track { flex: 1; height: 6px; background: rgba(0,0,0,0.08); border-radius: 999px; margin: 0 14px; overflow: hidden; }
.sd-progress-fill { height: 100%; background: var(--ink); border-radius: 999px; transition: width 0.25s ease; }
.sd-counter { font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: var(--ink-soft); white-space: nowrap; }

.sd-card-stage { display: flex; flex-direction: column; align-items: center; margin: 10px 0 18px; }
.sd-flip-outer { width: 100%; max-width: 420px; height: 300px; perspective: 1400px; cursor: pointer; }
.sd-flip-inner {
  position: relative; width: 100%; height: 100%;
  transition: transform 0.5s cubic-bezier(.4,.2,.2,1); transform-style: preserve-3d;
}
.sd-flip-inner.flipped { transform: rotateY(180deg); }
.sd-face {
  position: absolute; inset: 0; border-radius: 14px;
  backface-visibility: hidden; -webkit-backface-visibility: hidden;
  background: var(--card); border: 1px solid var(--border);
  box-shadow: 0 8px 24px var(--shadow);
  padding: 26px 24px;
  display: flex; flex-direction: column;
  background-image: repeating-linear-gradient(
    to bottom, transparent, transparent 27px, var(--rule-blue) 27px, var(--rule-blue) 28px
  );
  background-position: 0 64px;
}
.sd-face::before {
  content: ""; position: absolute; left: 40px; top: 0; bottom: 0; width: 1.5px; background: var(--rule-red);
  opacity: 0.55;
}
.sd-face-back { transform: rotateY(180deg); }
.sd-tab {
  align-self: flex-start; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.03em;
  text-transform: uppercase; color: #fff; padding: 3px 9px; border-radius: 5px; margin-bottom: 14px;
  position: relative; z-index: 1;
}
.sd-card-front-word {
  font-family: 'Fraunces', serif; font-weight: 700; font-size: 32px; line-height: 1.15;
  color: var(--ink); position: relative; z-index: 1; margin-left: 8px;
}
.sd-card-front-pos {
  font-family: 'Fraunces', serif; font-style: italic; font-size: 14px; color: var(--ink-soft);
  margin-top: 6px; margin-left: 8px; position: relative; z-index: 1;
}
.sd-card-hint {
  margin-top: auto; font-size: 11.5px; color: var(--ink-soft); text-align: center; position: relative; z-index: 1;
  font-family: 'IBM Plex Mono', monospace;
}
.sd-card-back-def {
  font-family: 'Fraunces', serif; font-size: 17.5px; line-height: 1.45; color: var(--ink);
  margin-left: 8px; position: relative; z-index: 1;
}
.sd-card-back-example {
  font-size: 13.5px; font-style: italic; color: var(--ink-soft); margin-top: 12px; margin-left: 8px;
  position: relative; z-index: 1;
}
.sd-card-back-example b { font-style: normal; color: var(--mustard); font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
.sd-box-indicator {
  position: absolute; top: 16px; right: 18px; display: flex; gap: 4px; z-index: 1;
}
.sd-box-dot { width: 7px; height: 7px; border-radius: 999px; background: rgba(35,39,58,0.15); }
.sd-box-dot.filled { background: var(--mustard); }
.sd-box-label { position: absolute; top: 28px; right: 18px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--ink-soft); z-index: 1; }

.sd-rate-row { display: flex; gap: 12px; margin-top: 18px; width: 100%; max-width: 420px; }
.sd-rate-row .sd-btn { flex: 1; justify-content: center; padding: 13px; font-size: 15px; }
.sd-key-hint { text-align: center; font-size: 12px; color: var(--ink-soft); margin-top: 14px; font-family: 'IBM Plex Mono', monospace; }

.sd-summary { text-align: center; padding: 30px 10px; }
.sd-summary-stats { display: flex; justify-content: center; gap: 22px; margin: 26px 0; flex-wrap: wrap; }
.sd-summary-stat { display: flex; flex-direction: column; align-items: center; }
.sd-summary-num { font-family: 'Fraunces', serif; font-size: 30px; font-weight: 700; }
.sd-summary-label { font-size: 12px; color: var(--ink-soft); margin-top: 2px; }

.sd-modal-overlay {
  position: fixed; inset: 0; background: rgba(20,20,20,0.35); display: flex; align-items: center; justify-content: center;
  z-index: 50; padding: 20px;
}
.sd-modal {
  background: var(--card); border-radius: 14px; padding: 22px; max-width: 320px; width: 100%;
  box-shadow: 0 12px 30px rgba(0,0,0,0.25);
}
.sd-modal h3 { font-family: 'Fraunces', serif; margin: 0 0 8px; font-size: 18px; }
.sd-modal p { font-size: 13.5px; color: var(--ink-soft); margin: 0 0 16px; }
.sd-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }

.sd-empty { text-align: center; padding: 40px 10px; color: var(--ink-soft); }
.sd-empty .sd-serif { font-size: 20px; color: var(--ink); display: block; margin-bottom: 6px; }

@media (max-width: 480px) {
  .sd-form-grid { grid-template-columns: 1fr; }
  .sd-heading { font-size: 25px; }
  .sd-flip-outer { height: 320px; }
  .sd-card-front-word { font-size: 26px; }
}
`;

const TAG_COLORS = {
  "Top & Common Words": "var(--burgundy)",
  "Tricky & Confusable Meanings": "var(--teal)",
  "Word Origins": "var(--mustard)",
  "Money & Finance": "var(--navy)",
  "Themed Vocab": "var(--burgundy)",
  "By the Letter": "var(--teal)",
  "High Difficulty": "var(--hard)",
  "Percentages & Ratios": "var(--navy)",
  "Exponents & Roots": "var(--teal)",
  "Algebra Shortcuts": "var(--burgundy)",
  "Number Properties": "var(--mustard)",
  "Geometry: Triangles & Angles": "var(--navy)",
  "Geometry: Circles, Area & Volume": "var(--teal)",
  "Statistics & Probability": "var(--burgundy)",
  "Word Problem Strategies": "var(--mustard)",
  "Custom": "var(--ink)",
};

function tagColor(tag) {
  return TAG_COLORS[tag] || "var(--ink)";
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({});
  const [stats, setStats] = useState({ streak: 0, lastStudyDate: null, totalReviewed: 0 });
  const [customCards, setCustomCards] = useState([]);

  const [screen, setScreen] = useState("home");
  const [selectedDeck, setSelectedDeck] = useState(null); // 'vocab' | 'math' | 'all'
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [showAddForm, setShowAddForm] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ good: 0, hard: 0 });
  const [hintVisible, setHintVisible] = useState(true);

  const [form, setForm] = useState({ deck: "vocab", tag: "Custom", front: "", back: "", example: "" });

  useEffect(() => {
    (async () => {
      const [p, s, c] = await Promise.all([
        loadKey("progress", {}),
        loadKey("stats", { streak: 0, lastStudyDate: null, totalReviewed: 0 }),
        loadKey("customCards", []),
      ]);
      setProgress(p);
      setStats(s);
      setCustomCards(c);
      setLoading(false);
    })();
  }, []);

  const allCards = useMemo(() => [...CARDS_DATA, ...customCards], [customCards]);

  const deckCards = useCallback(
    (deck) => {
      if (deck === "all") return allCards;
      return allCards.filter((c) => c.deck === deck);
    },
    [allCards]
  );

  const deckDueCount = useCallback(
    (deck) => {
      const cards = deckCards(deck);
      return cards.filter((c) => isDue(getCardProg(progress, c.id))).length;
    },
    [deckCards, progress]
  );

  const deckMasteredCount = useCallback(
    (deck) => {
      const cards = deckCards(deck);
      return cards.filter((c) => getCardProg(progress, c.id).box >= 5).length;
    },
    [deckCards, progress]
  );

  const availableTags = useMemo(() => {
    if (!selectedDeck) return [];
    const cards = deckCards(selectedDeck);
    return Array.from(new Set(cards.map((c) => c.tag)));
  }, [selectedDeck, deckCards]);

  const filteredCards = useMemo(() => {
    if (!selectedDeck) return [];
    let cards = deckCards(selectedDeck);
    if (selectedTags.size > 0) {
      cards = cards.filter((c) => selectedTags.has(c.tag));
    }
    return cards;
  }, [selectedDeck, deckCards, selectedTags]);

  const filteredDueCount = useMemo(
    () => filteredCards.filter((c) => isDue(getCardProg(progress, c.id))).length,
    [filteredCards, progress]
  );

  function toggleTag(tag) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function selectDeck(deck) {
    setSelectedDeck(deck === selectedDeck ? null : deck);
    setSelectedTags(new Set());
  }

  function startSession() {
    const due = filteredCards.filter((c) => isDue(getCardProg(progress, c.id)));
    const pool = due.length > 0 ? due : filteredCards;
    const picked = shuffle(pool).slice(0, SESSION_CAP);
    setQueue(picked);
    setIdx(0);
    setFlipped(false);
    setHintVisible(true);
    setSessionStats({ good: 0, hard: 0 });
    setScreen("study");
  }

  function rate(correct) {
    const card = queue[idx];
    if (!card) return;
    setProgress((prev) => {
      const cur = getCardProg(prev, card.id);
      const newBox = correct ? Math.min(cur.box + 1, 5) : 1;
      const updated = {
        ...prev,
        [card.id]: {
          box: newBox,
          nextReview: nextReviewTime(newBox),
          seen: cur.seen + 1,
          correct: cur.correct + (correct ? 1 : 0),
        },
      };
      saveKey("progress", updated);
      return updated;
    });
    setSessionStats((s) => ({ good: s.good + (correct ? 1 : 0), hard: s.hard + (correct ? 0 : 1) }));

    if (idx + 1 >= queue.length) {
      finishSession();
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
      setHintVisible(false);
    }
  }

  function finishSession() {
    const reviewedCount = sessionStats.good + sessionStats.hard;
    if (reviewedCount > 0) {
      setStats((prev) => {
        const today = todayStr();
        let streak = prev.streak || 0;
        if (prev.lastStudyDate === today) {
          // already studied today, keep streak
        } else {
          const yesterday = new Date(Date.now() - DAY_MS).toISOString().slice(0, 10);
          streak = prev.lastStudyDate === yesterday ? streak + 1 : 1;
        }
        const updated = { streak, lastStudyDate: today, totalReviewed: (prev.totalReviewed || 0) + reviewedCount };
        saveKey("stats", updated);
        return updated;
      });
    }
    setScreen("summary");
  }

  function backToHome() {
    setScreen("home");
    setSelectedDeck(null);
    setSelectedTags(new Set());
  }

  function handleAddCard() {
    if (!form.front.trim() || !form.back.trim()) return;
    const newCard = {
      id: "c" + Date.now(),
      deck: form.deck,
      tag: form.tag.trim() || "Custom",
      front: form.front.trim(),
      pos: "",
      back: form.back.trim(),
      example: form.example.trim(),
    };
    setCustomCards((prev) => {
      const updated = [...prev, newCard];
      saveKey("customCards", updated);
      return updated;
    });
    setForm({ deck: form.deck, tag: form.tag, front: "", back: "", example: "" });
    setShowAddForm(false);
  }

  function deleteCustomCard(id) {
    setCustomCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      saveKey("customCards", updated);
      return updated;
    });
    setProgress((prev) => {
      if (!prev[id]) return prev;
      const { [id]: _, ...rest } = prev;
      saveKey("progress", rest);
      return rest;
    });
  }

  function doReset() {
    setProgress({});
    setStats({ streak: 0, lastStudyDate: null, totalReviewed: 0 });
    saveKey("progress", {});
    saveKey("stats", { streak: 0, lastStudyDate: null, totalReviewed: 0 });
    setShowReset(false);
  }

  // keyboard shortcuts on study screen
  useEffect(() => {
    if (screen !== "study") return;
    function onKey(e) {
      if (e.code === "Space" || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowLeft" || e.key === "1")) {
        rate(false);
      } else if (flipped && (e.key === "ArrowRight" || e.key === "2")) {
        rate(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, flipped, idx, queue]);

  const totalMastered = useMemo(
    () => allCards.filter((c) => getCardProg(progress, c.id).box >= 5).length,
    [allCards, progress]
  );

  if (loading) {
    return (
      <div className="sd-root">
        <style>{STYLES}</style>
        <div className="sd-wrap sd-empty">
          <span className="sd-serif">Opening the drawer…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-root">
      <style>{STYLES}</style>
      <div className="sd-wrap">
        <div className="sd-topbar">
          <div className="sd-brand">
            <span className="sd-serif sd-brand-title">Study Drawer</span>
            <span className="sd-brand-sub">GRE flashcards</span>
          </div>
          <div className="sd-topbar-right">
            <div className="sd-pill">
              <Flame size={14} color="var(--mustard)" />
              {stats.streak || 0} day{stats.streak === 1 ? "" : "s"}
            </div>
            <div className="sd-pill">{totalMastered} mastered</div>
            <div className="sd-icon-btn" onClick={() => setShowReset(true)} title="Settings">
              <Settings size={16} />
            </div>
          </div>
        </div>

        {screen === "home" && (
          <>
            <div className="sd-heading sd-serif">What are we studying?</div>
            <div className="sd-subtext">Pick a deck, narrow it down if you want, then start a round.</div>

            <div className="sd-decks">
              <div
                className={"sd-deck-card vocab" + (selectedDeck === "vocab" ? " active" : "")}
                onClick={() => selectDeck("vocab")}
              >
                <div className="sd-deck-icon"><BookOpen size={18} /></div>
                <div className="sd-deck-name sd-serif">Vocabulary</div>
                <div className="sd-deck-meta">{deckCards("vocab").length} words</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("vocab")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("vocab")} mastered</span>
                </div>
              </div>
              <div
                className={"sd-deck-card math" + (selectedDeck === "math" ? " active" : "")}
                onClick={() => selectDeck("math")}
              >
                <div className="sd-deck-icon"><Calculator size={18} /></div>
                <div className="sd-deck-name sd-serif">Math rules & tricks</div>
                <div className="sd-deck-meta">{deckCards("math").length} cards</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("math")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("math")} mastered</span>
                </div>
              </div>
              <div
                className={"sd-deck-card all" + (selectedDeck === "all" ? " active" : "")}
                onClick={() => selectDeck("all")}
              >
                <div className="sd-deck-icon"><Layers size={18} /></div>
                <div className="sd-deck-name sd-serif">Everything</div>
                <div className="sd-deck-meta">{deckCards("all").length} cards total</div>
                <div className="sd-deck-stats">
                  <span className="sd-stat-chip due">{deckDueCount("all")} due</span>
                  <span className="sd-stat-chip">{deckMasteredCount("all")} mastered</span>
                </div>
              </div>
            </div>

            {selectedDeck && (
              <div className="sd-panel">
                <div className="sd-panel-title">Narrow it down (optional)</div>
                <div className="sd-tags">
                  {availableTags.map((tag) => (
                    <div
                      key={tag}
                      className={"sd-tag-chip" + (selectedTags.has(tag) ? " selected" : "")}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </div>
                  ))}
                </div>
                <div className="sd-start-row">
                  <button className="sd-btn sd-btn-primary" onClick={startSession} disabled={filteredCards.length === 0}>
                    {filteredDueCount > 0
                      ? `Start studying (${Math.min(filteredDueCount, SESSION_CAP)} due)`
                      : `Free practice (${Math.min(filteredCards.length, SESSION_CAP)} cards)`}
                  </button>
                  {filteredCards.length === 0 && (
                    <span className="sd-subtext" style={{ marginBottom: 0 }}>No cards match that filter yet.</span>
                  )}
                </div>
              </div>
            )}

            <div className="sd-panel">
              <div className="sd-panel-title">Your own cards</div>
              {!showAddForm ? (
                <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowAddForm(true)}>
                  <Plus size={14} /> Add a card
                </button>
              ) : (
                <div>
                  <div className="sd-form-grid">
                    <div className="sd-field">
                      <label>Deck</label>
                      <select value={form.deck} onChange={(e) => setForm({ ...form, deck: e.target.value })}>
                        <option value="vocab">Vocabulary</option>
                        <option value="math">Math</option>
                      </select>
                    </div>
                    <div className="sd-field">
                      <label>Tag / category</label>
                      <input
                        value={form.tag}
                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                        placeholder="Custom"
                      />
                    </div>
                    <div className="sd-field full">
                      <label>Front (word or concept)</label>
                      <input value={form.front} onChange={(e) => setForm({ ...form, front: e.target.value })} />
                    </div>
                    <div className="sd-field full">
                      <label>Back (definition or rule)</label>
                      <textarea value={form.back} onChange={(e) => setForm({ ...form, back: e.target.value })} />
                    </div>
                    <div className="sd-field full">
                      <label>Example (optional)</label>
                      <input value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="sd-btn sd-btn-primary sd-btn-sm" onClick={handleAddCard}>Save card</button>
                    <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </div>
              )}
              {customCards.length > 0 && (
                <div className="sd-custom-list">
                  {customCards.map((c) => (
                    <div className="sd-custom-row" key={c.id}>
                      <span className="sd-custom-row-text"><b>{c.front}</b> — {c.tag}</span>
                      <button className="sd-del-btn" onClick={() => deleteCustomCard(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {screen === "study" && queue.length > 0 && (
          <>
            <div className="sd-study-top">
              <div className="sd-icon-btn" onClick={finishSession} title="End session">
                <ArrowLeft size={16} />
              </div>
              <div className="sd-progress-track">
                <div className="sd-progress-fill" style={{ width: `${(idx / queue.length) * 100}%` }} />
              </div>
              <div className="sd-counter">{idx + 1} / {queue.length}</div>
            </div>

            <div className="sd-card-stage">
              <div className="sd-flip-outer" onClick={() => setFlipped((f) => !f)}>
                <div className={"sd-flip-inner" + (flipped ? " flipped" : "")}>
                  <div className="sd-face">
                    <span className="sd-tab" style={{ background: tagColor(queue[idx].tag) }}>{queue[idx].tag}</span>
                    <div className="sd-card-front-word">{queue[idx].front}</div>
                    {queue[idx].pos && <div className="sd-card-front-pos">{queue[idx].pos}.</div>}
                    {hintVisible && <div className="sd-card-hint">tap to flip</div>}
                  </div>
                  <div className="sd-face sd-face-back">
                    <BoxIndicator box={getCardProg(progress, queue[idx].id).box} />
                    <div className="sd-card-back-def">{queue[idx].back}</div>
                    {queue[idx].example && (
                      <div className="sd-card-back-example"><b>e.g.</b> &nbsp;{queue[idx].example}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="sd-rate-row">
                <button className="sd-btn sd-btn-hard" onClick={() => rate(false)} disabled={!flipped}>
                  <RotateCcw size={15} /> Still learning
                </button>
                <button className="sd-btn sd-btn-good" onClick={() => rate(true)} disabled={!flipped}>
                  <Check size={15} /> Got it
                </button>
              </div>
              <div className="sd-key-hint">space to flip · ← still learning · → got it</div>
            </div>
          </>
        )}

        {screen === "summary" && (
          <div className="sd-summary">
            <div className="sd-serif" style={{ fontSize: 24, fontWeight: 600 }}>
              {sessionStats.good + sessionStats.hard === 0
                ? "No cards reviewed."
                : sessionStats.hard === 0
                ? "Clean sweep."
                : "Nice work."}
            </div>
            <div className="sd-summary-stats">
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--ink)" }}>{sessionStats.good + sessionStats.hard}</div>
                <div className="sd-summary-label">reviewed</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--good)" }}>{sessionStats.good}</div>
                <div className="sd-summary-label">got it</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--hard)" }}>{sessionStats.hard}</div>
                <div className="sd-summary-label">still learning</div>
              </div>
              <div className="sd-summary-stat">
                <div className="sd-summary-num sd-mono" style={{ color: "var(--mustard)" }}>{stats.streak || 0}</div>
                <div className="sd-summary-label">day streak</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="sd-btn sd-btn-secondary" onClick={backToHome}>Back to Study Drawer</button>
              {filteredCards.length > 0 && (
                <button className="sd-btn sd-btn-primary" onClick={startSession}>Study another round</button>
              )}
            </div>
          </div>
        )}

        {showReset && (
          <div className="sd-modal-overlay" onClick={() => setShowReset(false)}>
            <div className="sd-modal" onClick={(e) => e.stopPropagation()}>
              <h3 className="sd-serif">Reset progress?</h3>
              <p>This clears every card's box and your streak. Your custom cards stay put.</p>
              <div className="sd-modal-actions">
                <button className="sd-btn sd-btn-secondary sd-btn-sm" onClick={() => setShowReset(false)}>Cancel</button>
                <button className="sd-btn sd-btn-hard sd-btn-sm" onClick={doReset}>
                  <X size={14} /> Reset everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BoxIndicator({ box }) {
  return (
    <>
      <div className="sd-box-indicator">
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className={"sd-box-dot" + (n <= box ? " filled" : "")} />
        ))}
      </div>
      <div className="sd-box-label">box {box}/5</div>
    </>
  );
}
