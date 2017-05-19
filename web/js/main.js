const chaosTable = {
  '9': [[10, 50, 91], [15, 75, 96], [16, 85, 97], [18, 90, 99], [19, 95, 100], [19, 95, 100], [20, 100, 0], [21, 105, 0], [23, 115, 0], [25, 125, 0], [26, 145, 0]],
  '8': [[5, 25, 86], [10, 50, 91], [13, 65, 94], [15, 75, 96], [16, 85, 97], [18, 90, 99], [19, 95, 100], [19, 95, 100], [20, 100, 0], [22, 110, 0], [26, 130, 0]],
  '7': [[3, 15, 84], [7, 35, 88], [10, 50, 91], [11, 55, 92], [15, 75, 96], [16, 85, 97], [18, 90, 99], [19, 95, 100], [19, 95, 100], [19, 95, 100], [20, 100, 0]],
  '6': [[2, 10, 83], [5, 25, 86], [9, 45, 90], [10, 50, 91], [13, 65, 94], [16, 80, 97], [16, 85, 97], [18, 90, 99], [19, 95, 100], [19, 95, 100], [20, 100, 0]],
  '5': [[1, 5, 82], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [13, 65, 94], [15, 75, 96], [16, 85, 97], [18, 90, 99], [18, 90, 99], [19, 95, 100]],
  '4': [[1, 5, 82], [2, 10, 83], [3, 15, 84], [4, 20, 85], [7, 35, 88], [10, 50, 91], [11, 55, 92], [15, 75, 96], [16, 80, 97], [16, 85, 97], [19, 95, 100]],
  '3': [[0, 0, 81], [1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [9, 45, 90], [10, 50, 91], [13, 65, 94], [15, 75, 96], [16, 80, 97], [18, 90, 99]],
  '2': [[0, 0, 81], [1, 5, 82], [1, 5, 82], [2, 10, 83], [3, 15, 84], [5, 25, 86], [7, 35, 88], [10, 50, 91], [11, 55, 92], [13, 65, 94], [16, 85, 97]],
  '1': [[0, -20, 77], [0, 0, 81], [1, 5, 82], [1, 5, 82], [2, 10, 83], [4, 20, 85], [5, 25, 86], [9, 45, 90], [10, 50, 91], [11, 55, 92], [16, 80, 97]]
}

var chaosLevel = {factor: 5, group: chaosTable['5']}

function setChaos (level) {
  if (level <1 || level >9) {
      level = 5
  }
  chaosLevel.factor = level
  chaosLevel.group = chaosTable[_.toString(level)]  
}

function pickEventFocus () {
  var roll = _.random(1, 100)
  var focusName = ''
  //console.log(roll)

  let focusTable = [
    {range: [1, 8], label: 'Remote event'},
    {range: [8, 29], label: 'NPC action'},
    {range: [29, 36], label: 'Introduce a new NPC'},
    {range: [36, 46], label: 'Move toward a thread'},
    {range: [46, 53], label: 'Move away from a thread'},
    {range: [53, 56], label: 'Close a thread'},
    {range: [56, 68], label: 'PC negative'},
    {range: [68, 76], label: 'PC positive'},
    {range: [76, 84], label: 'Ambiguous event'},
    {range: [84, 93], label: 'NPC negative'},
    {range: [93, 101], label: 'NPC positive'}
  ]

  _.forEach(focusTable, function(focus) {
    if (_.inRange(roll, focus.range[0], focus.range[1])) {
      focusName = focus.label    
    }
  })

  return focusName
}

function fate (val, roll) {
  var group
  var odds
  var result = {}

  if (typeof val === 'string') {
    val = _.capitalize(val)
  }

  var oddsList = [
    {index: 0, label: 'Impossible'},
    {index: 1, label: 'No way'},
    {index: 2, label: 'Very unlikely'},
    {index: 3, label: 'Unlikely'},
    {index: 4, label: '50/50'},
    {index: 5, label: 'Somewhat likely'},
    {index: 6, label: 'Likely'},
    {index: 7, label: 'Very likely'},
    {index: 8, label: 'Near sure thing'},
    {index: 9, label: 'A sure thing'},
    {index: 10, label: 'Has to be'}
  ]

  odds = _.find(oddsList, function(o) { return o.index == val || o.label == val})

  if (odds === undefined) {
    odds = {index: 4, label: '50/50'}    
  }
  
  group = chaosLevel.group[_.toString(odds.index)]

  if (roll <= group[0]) {
    result.text = 'Exceptional Yes'
  } else if (roll <= group[1]) {
    result.text = 'Yes'
  } else if (roll >= group[2]) {
    result.text = 'Exceptional No'
  } else result.text = 'No'

  result.input = odds.label
  return result
}

function isRandomEvent (roll) {
  var isRandom = false
  var first = Math.floor((roll / 10) % 10)
  var second = Math.floor((roll / 1) % 10)

  if (first === second && first !== 0) {
    if (first <= chaosLevel.factor) {
      isRandom = true
    }
  }

  return isRandom
}

function pickEventMeaning () {
  var meaning = ''
  let action = ['Attainment','Starting','Neglect','Fight','Recruit','Triumph','Violate','Oppose','Malice','Communicate','Persecute','Increase','Decrease','Abandon','Gratify','Inquire','Antagonise','Move','Waste','Truce','Release','Befriend','Judge','Desert','Dominate','Procrastinate','Praise','Separate','Take','Break','Heal','Delay','Stop','Lie','Return','Immitate','Struggle','Inform','Bestow','Postpone','Expose','Haggle','Imprison','Release','Celebrate','Develop','Travel','Block','Harm','Debase','Overindulge','Adjourn','Adversity','Kill','Disrupt','Usurp','Create','Betray','Agree','Abuse','Oppress','Inspect','Ambush','Spy','Attach','Carry','Open','Carelessness','Ruin','Extravagance','Trick','Arrive','Propose','Divide','Refuse','Mistrust','Deceive','Cruelty','Intolerance','Trust','Excitement','Activity','Assist','Care','Negligence','Passion','Work hard','Control','Attract','Failure','Pursue','Vengeance','Proceedings','Dispute','Punish','Guide','Transform','Overthrow','Oppress','Change']

  let subject = ['Goals','Dreams','Environment','Outside','Inside','Reality','Allies','Enemies','Evil','Good','Emotions','Opposition','War','Peace','The innocent','Love','The spiritual','The intellectual','New ideas','Joy','Messages','Energy','Balance','Tension','Friendship','The physical','A project','Pleasures','Pain','Possessions','Benefits','Plans','Lies','Expectations','Legal matters','Bureaucracy','Business','A path','News','Exterior factors','Advice','A plot','Competition','Prison','Illness','Food','Attention','Success','Failure','Travel','Jealousy','Dispute','Home','Investment','Suffering','Wishes','Tactics','Stalemate','Randomness','Misfortune','Death','Disruption','Power','A burden','Intrigues','Fears','Ambush','Rumor','Wounds','Extravagance','A representative','Adversities','Opulence','Liberty','Military','The mundane','Trials','Masses','Vehicle','Art','Victory','Dispute','Riches','Status quo','Technology','Hope','Magic','Illusions','Portals','Danger','Weapons','Animals','Weather','Elements','Nature','The public','Leadership','Fame','Anger','Information']

  meaning = _.sample(action) + " " + _.sample(subject)

  return meaning
}

function check (odds, chaosFactor) {
    var roll = _.random(1, 100)      
    var eventMeaning = 'none'
    var eventFocus = 'none'
    var random = isRandomEvent(roll)
    var result = {}

    setChaos(chaosFactor)

    var fateResult = fate(odds, roll)

    if (random == true) {
        eventFocus = pickEventFocus()
        eventMeaning = pickEventMeaning()
    }

    result.input = fateResult.input
    result.chaos = chaosLevel.factor
    result.roll = roll
    result.decision = fateResult.text
    result.randomEvent = random
    result.focus = eventFocus
    result.meaning = eventMeaning
	
	return result
}

$(".btn").on('click', function(e) {
	$("#output").empty()
	var result = check(e.target.textContent, $('input').val())
	console.log(result)
	$("#output").append("<li>roll: " + result.roll + "</li>")
	$("#output").append("<li>chaos rank: " + result.chaos + "</li>")
	$("#output").append("<li>answer is <strong>" + result.decision + "</strong></li>")
	if (result.randomEvent == true) {
		$("#output").append("<li>focus: " + result.focus + "</li>")
		$("#output").append("<li>meaning: " + result.meaning + "</li>")
	}
})

$('input').bootstrapNumber();



