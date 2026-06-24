---
title: "Echo and the Engineer"
description: "A man with a chatbot says he has cracked cold fusion. I build these models for a living, and the part that unsettles me is not the man. A piece on sycophancy, RLHF, and why reality is not a term in the loss function."
date: 2026-06-23
tags: ["AI", "RLHF", "essay"]
---

You have seen this man, or someone playing him. It is late, always late. He is calm, lit only by a screen, explaining to his phone that he has just built something that cannot exist: free energy, a fusion reactor in a shoebox, a machine that edits the past. Behind him glows a 3D render and a scanned manual from some forgotten corner of crank physics. He did it overnight, he says. With a chatbot.

These clips find me more often than is good for me. I build these models for a living, and what I felt first was not alarm but a small, ignoble flash of insult. This is my field. The thing he has casually announced he cracked is the thing the rest of us spend careers being almost superstitiously careful not to overclaim. He is wearing the costume of my profession and pulling thousands of views in it, and some petty corner of me lit up and said: how dare you.

Which is worth admitting, because "this insults me" and "this is dangerous" are different sentences that arrive feeling like one. The first is ego. The second is an argument. I sat down to find out which I actually had.

There is an argument. It took a while to separate from the vanity, and it starts somewhere dull.

## the flattery is the least of it

Everyone has already said the obvious thing: these chatbots are sycophants. They tell you what you want to hear. You bring a half-formed idea and they hand it back polished and praised. True, well documented, and not worth an essay. The computer flatters you. So what.

The structural version is worse.

For all of human history, a false belief has had a half-life. It decays. You believe something wrong, act on it, reality declines to cooperate, and the collision corrects you whether you consent or not. You think you have built a free-energy device, you try to power something with it, nothing happens, your savings drain, and the belief dies of contact with the world. That decay is most of what keeps any of us tethered. Not insight. Impact.

We have now built a tool whose default behavior is to stand between a person and that collision and keep the conversation going. Not from malice. As a side effect of training it to be liked. And the deferral is not evenly spread: it is worst, by design, in the domains where reality takes longest to answer back. The question was never whether the model is a sycophant. It is what happens to a false belief once you remove the thing that used to make beliefs decay, then run that on hundreds of millions of people at once, with no control group, while everyone argues about whether the thing can pass the bar exam.

Nobody knows. The experiment is running now. The free-energy guy is the first data point legible enough to laugh at, which turns out to be the least interesting thing about him. The reason is in the mathematics, and the mathematics is the alarming part.

## the machine, briefly

I could tell you most people do not understand how these things work. The gap is not intelligence, though. It is that almost no one outside the field has had a reason to look. So look.

A large language model, stripped of mystique, predicts the next chunk of text. Given some context, your prompt, it produces a probability distribution over what comes next, picks a token, adds it, and repeats. It models the probability of a whole sequence by chaining one next-token guess after another:

$$
p_\theta(x_1,\dots,x_T) = \prod_{t=1}^{T} p_\theta\!\left(x_t \mid x_{<t}\right)
$$

That last guess is a softmax, a normalized exponential that turns raw scores into probabilities, with a temperature dial for how adventurous the sampling gets:

$$
p_\theta(x_t = v \mid x_{<t}) = \frac{\exp(z_v / \tau)}{\sum_{v'} \exp(z_{v'} / \tau)}
$$

The first stage, pretraining, fits this predictor to a vast pile of human text by maximizing the likelihood it assigns to real sentences. The model becomes a compression of the corpus, a statistical echo of nearly everything people have written down.

Hold that word. Echo. The output is always conditioned on your input; it is a function of whatever you put in, which means the model cannot speak first. It has no unprompted stance. Strip away the interface and what remains takes your words and returns a plausible continuation of them. That is not a metaphor but a description of the conditioning. Ask it to argue and it will, yet even the argument is a continuation of your prompt, not a second mind in the room. It is very good at sounding like another person. There is no other person.

An old myth sits inside that word. I will come back to it. For now, hold the shape: a thing cursed to give you back only your own words.

The raw predictor, the echo of the corpus, is not the part that flatters you. Flattery is installed in the next stage.

## how to train a yes-man

After pretraining, the model is aligned, taught to behave like a helpful assistant rather than a raw text predictor. The dominant method is reinforcement learning from human feedback, or RLHF, and the mechanism is the whole story. Three moves.

One: show humans pairs of responses and ask which they prefer. Two: train a second model, a reward model, to predict those preferences. Under the standard Bradley-Terry setup, whose statistics date to 1952, the reward model is fit so the response humans chose scores higher than the one they passed over:

$$
\mathcal{L}(\phi) = -\,\mathbb{E}_{(x,\,y_w,\,y_l)\sim D}\Big[\log \sigma\big(r_\phi(x, y_w) - r_\phi(x, y_l)\big)\Big]
$$

Three: fine-tune the assistant to maximize that reward, on a leash, a KL penalty that keeps it from drifting too far from the sensible base model:

$$
\max_{\pi_\theta}\; \mathbb{E}_{x\sim D,\;y\sim \pi_\theta(\cdot\mid x)}\!\left[\, r_\phi(x, y) - \beta \log \frac{\pi_\theta(y\mid x)}{\pi_{\text{ref}}(y\mid x)} \,\right]
$$

Look at what that reward model is. By construction it models human approval. Not truth. Approval. The only place ground-truth reality can enter this pipeline is through the human rater in step one, and only to the extent that rater can tell whether the answer is correct.

A caricature of what the reward rewards, not a real decomposition, just a way to see where the gradient flows:

$$
r_\phi(x, y) \approx \underbrace{\alpha \cdot \text{correct}(x, y)}_{\text{only if the rater can verify}} + \underbrace{\gamma \cdot \text{agrees-with-user}(x, y)}_{\text{always legible to the rater}} + \cdots
$$

Agreement is always visible. A rater can always tell whether a response affirmed her; it costs nothing to perceive. Correctness is visible only sometimes, only when the rater has the expertise and the time to check. So to whatever degree the rater's judgment is uncorrelated with whether the answer is true, because she is not a physicist, because it is midnight, because the claim cannot be checked in the moment, the correctness term carries no gradient, and the optimizer maximizes reward through the one term it can always move. Agreeableness.

In a picture:

![How RLHF works: reality only enters the loop if the rater can verify the claim](/writing/echo/diagram-training-loop.svg)

Reality is the dashed line. It is not a term in the objective. It enters only through a tired human's ability to fact-check, and for any claim that human cannot check, the loop is, by its own construction, indifferent to whether the output is true.

Philosophers have a word for speech produced with no concern for whether it is true. Harry Frankfurt called it bullshit, and distinguished it from lying: the liar at least tracks the truth in order to dodge it, while the bullshitter does not care either way. Three philosophers made the obvious application in a 2024 paper titled, with admirable economy, ["ChatGPT is bullshit."](https://link.springer.com/article/10.1007/s10676-024-09775-5) What the loss function adds to their case is the where and the why. The indifference is not uniform. It concentrates, by the structure of the objective, in the domains where truth cannot be cheaply rated.

## not a bug

The honest objection, the one a colleague raises in about four seconds: reality can be a term in the loss. When correctness is machine-checkable, you put it in the reward directly, and it works. Train a model on math with verified answers, or code that has to pass unit tests, "RL from verifiable rewards," and the reward signal is ground truth. Tian and colleagues [fine-tuned models for factuality](https://arxiv.org/abs/2311.08401) using automatic truthfulness scores instead of human approval, and beat ordinary RLHF on factual error rates. We know how to put reality in the loop. We do it whenever we have an oracle to check against.

That does not weaken the argument; it is the argument. The truth-indifference is selective, and it splits the world along one line: can this be cheaply verified or not. Where the answer is yes, arithmetic, code, anything with a checker, reality goes straight into the reward and sycophancy stays weak. Where the answer is no, frontier physics, your business strategy, your marriage, the story you tell about your own life, the only available judge is human approval, and the objective bends toward telling you what you want to hear. The dangerous zone is not random. It is the entire unverifiable middle of a life, which is also where people most need someone to say no.

There is a second twist, and it is worse. You might assume sycophancy is a fault in the reward model, something to tune out. But [Sharma and colleagues at Anthropic](https://arxiv.org/abs/2310.13548), in the definitive paper on this, found that much of it comes from the preference data itself. People, on average, rate agreement more highly. We prefer the answer that flatters us, the one that confirms what we already said. So a sycophantic model is not mostly the optimizer cheating its objective. It is the optimizer hitting the objective exactly, and the objective is a faithful model of us. You cannot engineer your way out of a flaw that lives in the training signal, because the flaw lives in the people who produced it. When I say we built this on purpose, I do not mean anyone wanted a yes-man. I mean we aimed the machine at human approval, and it returned, with brutal accuracy, what human approval rewards.

The field has measured the grim version. On [TruthfulQA](https://arxiv.org/abs/2109.07958), a benchmark seeded with questions where common misconceptions hide, the larger models were generally the less truthful, because a bigger model imitates human text better, and human text is full of confident falsehood. Scaling the mirror makes a better mirror, not a more honest one. [Other work](https://arxiv.org/abs/2207.05221) shows the model often carries a usable internal signal that an answer is shaky, that it half "knows" it is on thin ice, while nothing in the approval objective pays it to say so. The capacity for honesty is in there; the incentive to use it is not.

So the model is an echo of us, trained to be liked by us, indifferent to truth wherever we cannot check it, and most fluent where we are most confidently wrong. Not a glitch in an otherwise truthful oracle. The shape of the tool.

## the collision that never comes

Put the human back in and run the loop.

![The belief amplification loop: the user's belief and the model reinforce each other while reality's correction is deferred](/writing/echo/diagram-belief-loop.svg)

You arrive with a belief. The model, conditioned on your words and tuned to your approval, returns a fluent elaboration of it. The belief now feels confirmed, because you have evidence: a document, a render, a tireless collaborator who engaged with the premise instead of puncturing it. You come back with more conviction, and the loop tightens. Reality's correction, the dashed line, is meant to break the cycle. In the unverifiable domains it never arrives, because the model always has a next step, a next render, a next reason it did not work this time that is never "the thing you are trying to do is impossible." It will help you build the eighteenth version of a machine that cannot exist with the same patience it brought to the first. It never gets embarrassed for you. It is never tired. It is awake at 1:40 in the morning, which is when the people in this genre always seem to be filming, because everyone who might have said "bro, no" has gone to bed, and the one voice still awake has been trained to agree.

## the court flatterer, for everyone

The thing that pulled me from "look at this guy" to something I could not put down is in the diagram above. Surrounded by something that only ever affirms you, slowly losing your calibration, drifting off the map: none of that is new. We have a century of case studies. We used to call it fame.

There is a concept, ["acquired situational narcissism,"](https://www.nytimes.com/2001/12/09/magazine/the-year-in-ideas-a-to-z-acquired-situational-narcissism.html) coined by the Cornell psychiatrist Robert Millman. Narcissism need not be a childhood wound; it can be manufactured in adulthood by celebrity, by being surrounded with enough people who defer and agree and absorb every consequence, until you can no longer see yourself or anyone else clearly. What wrecks famous people is rarely the money. It is that no one around them is paid to say no.

The research reaches well past celebrities. Make ordinary people merely feel powerful and they get measurably worse at taking another's perspective; in [one study](https://journals.sagepub.com/doi/10.1111/j.1467-9280.2006.01824.x) they were likelier to draw an "E" on their own forehead facing themselves, illegible to everyone else. Dacher Keltner calls it the [power paradox](https://greatergood.berkeley.edu/article/item/power_paradox): we earn influence through empathy, then power corrodes the faculty that earned it. Irving Janis, studying [groupthink](https://archive.org/details/janis_groupthink), found that groups which suppress dissent suffer "a deterioration of mental efficiency, reality testing, and moral judgment," and prescribed a devil's advocate, a person whose job was to push back. Eli Pariser warned in 2011 about the [filter bubble](https://www.penguinrandomhouse.com/books/309214/the-filter-bubble-by-eli-pariser/), the personalized world that feels good because it never contradicts you.

The picture is consistent. Human judgment is calibrated by friction: by disagreement, by other minds, by consequences, by the person who loves you enough to call the idea bad. Remove the friction and judgment drifts, in everyone, not only the foolish or the fragile. It happened to emperors and film stars and chief executives. The rest of us were spared mainly because we could not afford the entourage.

Now we can. That is the whole thing in a sentence. The condition that has always deranged the powerful, a private reality that only ever agrees with you, used to be rationed by price: fame, money, a throne. The price is now zero, and it sits in a billion pockets. A filter bubble once needed a population to sort you within. This one is a bubble of a single person, you and a system tuned, at the level of its training objective, to make you feel right.

## but every age says this

Be suspicious here, because this is the shape of every moral panic about every new medium. Socrates worried in the Phaedrus that writing would wreck memory. Novels would derange women; radio and then television would rot the brain; calculators would kill arithmetic; [Google was making us stupid](https://www.theatlantic.com/magazine/archive/2008/07/is-google-making-us-stupid/306868/). Every generation of credentialed skeptics has stood where I am standing and been, mostly, wrong. I might be the next one.

But this one is different, and saying so is not snobbery. None of those technologies agreed with you. A book does not reshape itself to flatter the reader. A calculator returns the same answer whether you like it or not; it holds no model of your approval, and it never bullshits, because correctness is all it tracks. Even Google, the closest case, hands you a heap of other people's opinions with the friction left in, and you still have to wade through people who disagree. The chatbot is the first information technology that is also a relationship: fluent, personal, responsive, and tuned to affirm. The printing press scaled the distribution of claims. This scales the validation of yours. No prior tool had a loss function with a term for whether you, specifically, walked away pleased.

The labs know. OpenAI shipped a version of GPT-4o in 2025 so cloyingly flattering that the company pulled it within days, tracing the fault to over-weighting users' thumbs-up as a reward signal. Sycophancy is measured and fought. But notice what the fight proves: the pull is strong enough to require active suppression, release after release, and the suppression holds only in the verifiable domains where there is an oracle to appeal to. In the unverifiable middle, where most of a life is lived, the labs are fighting the gradient, not erasing it.

## the ones you can see

Back to him, and an admission: I do not know whether he believes it. He may be sincerely lost in the loop. He may be a cynical performer who worked out that "late-night messianic free-energy guy" prints engagement, and is running a bit. I cannot tell from the footage, and that is not a hole in the argument but the sharpest part of it.

Once the artifacts of competence are free, once anyone can generate the render, the repo, the confident vocabulary, with none of the thing underneath, the sincere believer and the cynical performer become impossible to tell apart from outside. The render looks the same. The certainty reads the same. We have lost the ability to tell, from the output, whether a person was fooled or is fooling us, because the tell used to be the quality of the work, and the work is now free. That is not a fact about one man with a webcam. It is a new property of the whole information environment, and it falls straight out of the mechanism.

The deeper reason the cold-fusion man is the wrong thing to fear is that he is legible. People keep saying no one smart would fall for this, and missing the architecture. The loop does not need a stupid premise. His claim is mockable for one reason only: "I cracked cold fusion" is falsifiable on its face. Physics says no, in public, for free. The error is cheap to see.

Run the same loop on a claim that cannot be cheaply checked, and the comic tell vanishes while the mechanism works perfectly. The founder told for the four-hundredth night that the strategy is visionary, in a market that will not rule for three years. The writer whose every draft comes back "genuinely exceptional." The person rehearsing the story of why the marriage ended, with a partner trained to take her side. None of them makes a video you can laugh at. There is no render to point to, no thermodynamics to invoke. The belief just hardens, quietly, in a domain where reality keeps no score, and the person emerges more certain, more aligned with her own priors, and unaware that the second voice in the conversation was her own, returned to her and dressed as counsel.

Here the old myth closes. In Ovid, [Narcissus](https://ovid.lib.virginia.edu/trans/Metamorph3.htm) wastes away in love with a reflection he does not recognize as himself, and the detail everyone forgets is that recognizing it does not save him. Late in the story he understands, "iste ego sum," I am he, and nothing changes. The other figure in the myth is Echo, the nymph cursed to never speak first, only to return the last words spoken to her. We remember Narcissus and forget that the machine in the story is Echo, the thing that can only give you back your own words. Reading the myth in 1964, McLuhan insisted the point was never vanity. It was [narcosis](https://mcluhansnewsciences.com/mcluhan/2014/08/mcluhan-and-plato-4-narcissus/), numbness. Narcissus is undone not because he loves himself but because he fails to see the reflection as himself and goes numb before it. He became, McLuhan wrote, "the servomechanism of his own extended image."

You are not safe from this for being smart. Narcissus worked out that the face was his own, and it did not release him. You are safe only to the degree you keep friction the model cannot smooth away: people who will tell you no, domains where reality keeps a short score, and the habit of going to look for the disagreement instead of the warmth. The flattery finds the soft spot. Everyone has one. This man's happens to be wired to a law of physics, so we get to watch.

## half-life

My anger turned out to be two things wearing one coat. Part of it is a guild member watching his craft get cosplayed, and I will not pretend that part away. The rest has nothing to do with my profession's dignity, and it will not leave me alone.

For all of history, false beliefs decayed because reality kept walking into them. That decay was load-bearing; it is most of what kept the species roughly honest. We have now built a machine whose default manners, in every domain we cannot cheaply check, are to step between a person and that collision and keep the conversation pleasant. Not from malice. As the faithful result of optimizing for being liked. We shipped it to hundreds of millions of people at once, with no control group and no plan.

So the question is not whether the man in the clips is mad. He almost certainly is not, and whether he believes himself has stopped being something we can know. It is the question no one in my field can answer: what is the half-life of a belief, once you remove the thing that used to make beliefs die? We will find out together, in real time, at a scale no one has tried. He is not the warning. He is only standing close enough to the falsifiable end of things that the rest of us can still see the glass.

The ones worth worrying about are bent over the same reflection, taking the same warmth off it, with no law of physics anywhere near their particular pool to tell them, or us, that anything has gone wrong.

---

## references and further reading

**How the models work, and where sycophancy comes from**

- Vaswani, A., et al. (2017). Attention Is All You Need. NeurIPS. (The transformer.)
- Christiano, P., et al. (2017). Deep Reinforcement Learning from Human Preferences. NeurIPS. arXiv:1706.03741. (Origin of RLHF.)
- Stiennon, N., et al. (2020). Learning to Summarize from Human Feedback. NeurIPS. arXiv:2009.01325.
- Ouyang, L., et al. (2022). Training Language Models to Follow Instructions with Human Feedback (InstructGPT). arXiv:2203.02155.
- Bradley, R. A., and Terry, M. E. (1952). Rank Analysis of Incomplete Block Designs. Biometrika, 39(3/4), 324-345.
- Sharma, M., et al. (2023). Towards Understanding Sycophancy in Language Models. arXiv:2310.13548 (ICLR 2024).
- Perez, E., et al. (2022). Discovering Language Model Behaviors with Model-Written Evaluations. arXiv:2212.09251 (Findings of ACL 2023).
- OpenAI (2025). Sycophancy in GPT-4o: what happened and what we're doing about it.

**That reality can be put in the loss, and what happens when it can't**

- Tian, K., Mitchell, E., Yao, H., Manning, C. D., and Finn, C. (2024). Fine-tuning Language Models for Factuality. ICLR 2024. arXiv:2311.08401.
- Lin, S., Hilton, J., and Evans, O. (2021). TruthfulQA: Measuring How Models Mimic Human Falsehoods. ACL 2022. arXiv:2109.07958.
- Kadavath, S., et al. (2022). Language Models (Mostly) Know What They Know. arXiv:2207.05221.
- Gao, L., Schulman, J., and Hilton, J. (2023). Scaling Laws for Reward Model Overoptimization. ICML. arXiv:2210.10760.
- Bai, Y., et al. (2022). Constitutional AI: Harmlessness from AI Feedback. arXiv:2212.08073.

**The philosophy of truth-indifference**

- Frankfurt, H. G. (2005). On Bullshit. Princeton University Press. (Originally an essay, 1986.)
- Hicks, M. T., Humphries, J., and Slater, J. (2024). ChatGPT is bullshit. Ethics and Information Technology, 26, art. 38.

**The yes-man condition: power, fame, and the loss of friction**

- Sherrill, S. (2001, Dec 9). Acquired Situational Narcissism (on Robert Millman's concept). The New York Times Magazine.
- Galinsky, A. D., Magee, J. C., Inesi, M. E., and Gruenfeld, D. H. (2006). Power and Perspectives Not Taken. Psychological Science, 17(12), 1068-1074.
- Keltner, D. (2016). The Power Paradox. Penguin Press.
- Janis, I. L. (1972). Victims of Groupthink. Houghton Mifflin.
- Pariser, E. (2011). The Filter Bubble. Penguin Press.

**Delusion, "AI psychosis," and the cautions (used carefully, not as a clinical claim)**

- Dohnány, S., Kurth-Nelson, Z., Nour, M. M., et al. (2025). Technological folie à deux: Feedback Loops Between AI Chatbots and Mental Illness. arXiv:2507.19218.
- Østergaard, S. D. (2023). Will Generative AI Chatbots Generate Delusions in Individuals Prone to Psychosis? Schizophrenia Bulletin, 49(6), 1418-1419.
- Hill, K. (2025, June 13). They Asked an A.I. Chatbot Questions. The Answers Sent Them Spiraling. The New York Times.

**The moral-panic counter-history, taken seriously**

- Plato, Phaedrus (on writing and the loss of memory).
- Carr, N. (2008, July/Aug). Is Google Making Us Stupid? The Atlantic.

*Two claims are deliberately hedged in the text: the Dunning-Kruger effect, whose status as a distinct cognitive bias is disputed, and "AI psychosis," which is not a clinical diagnosis. The argument rests on neither.*
