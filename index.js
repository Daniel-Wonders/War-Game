const getDeckBtnDom=document.getElementById("getDeckBtn")
const getCardsBtnDom=document.getElementById("getCardsBtn")
const imagesContainerDom=document.getElementById("imagesContainer")
let deckId
let computerScore=0
let userScore=0
let remainingCards



function getDeck() {
    fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
        .then(res => res.json())
        .then(data => {
            deckId=data.deck_id
            remainingCards=52
            document.getElementById("remainingCards").innerHTML=`
            <h3 id="remainingCards"> Remaining cards: ${data.remaining}</h3>`//When getting the deck, update the remaining cards display
            if (remainingCards!=0){
                getDeckBtnDom.disabled=true
            }
        })
    getCardsBtnDom.disabled=false;

}

function getCards(){//Gets 2 cards from the deck
    if(deckId){
        fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
        .then(response=>response.json())
        .then(data=>{
            renderCards(data.cards)
            remainingCards=remainingCards-2
            document.getElementById("remainingCards").innerHTML=`
            <h3 id="remainingCards"> Remaining cards: ${remainingCards}</h3>`//update the remaining cards
            if (remainingCards!=0){//only allow the shuffle deck btn when there are no remaining cards
                getDeckBtnDom.disabled=true
            }
            else if(remainingCards==0){//If the game has ended, allow the deck btn, display a modal with
                getDeckBtnDom.disabled=false//the winner and reset the scores
                document.getElementById("modal").style.display="block"
                document.getElementById("modal").innerHTML=`
                <button id="modalBtn">X</button>
                <h1>${winner()} won!</h1>`
                computerScore=0
                userScore=0
            }
        })
    }
    else{
        console.log("You neeed to draw a deck first")
    }
}

function winner(){
    if (computerScore>userScore){
        return "The computer has"
    }
    else if(computerScore<userScore){
        return "You have"
    }
    else{
        return "No one"
    }
}

function renderCards(cards){//Clean the previous cards and display  the new ones

    document.getElementById("computerCard").innerHTML=""//Clean the previous cards
    document.getElementById("userCard").innerHTML=""
    
    
    document.getElementById("computerCard").innerHTML=`
        <img src="${cards[0].image}">`//display the new cards
        
    document.getElementById("userCard").innerHTML=`
        <img src="${cards[1].image}">`

    determineRoundWinner(cardParser(cards[0].value),cardParser(cards[1].value))//Parse both cards and update scores and scores displays
}

function cardParser(Card){//Convert the value to a number(from a string)
    
    if(Card==="QUEEN"||Card==="JACK"||Card==="KING"){
        return 10
    }
    else if(Card==="ACE"){
        return 11
    }
    else{
        return parseInt(Card)

    }
  
}

function determineRoundWinner(computerCard, userCard){//update scores based on who won the round

    if (computerCard>userCard){
        computerScore++
        document.getElementById("computerScore").innerHTML=`<h4 id="computerScore">Computer score: ${computerScore}</h4>`
    }
    else if (computerCard<userCard){
        userScore++
        document.getElementById("userScore").innerHTML=`<h4 id="userScore">Your score: ${userScore}</h4>`
    }
}

document.getElementById("modal").addEventListener("click",function(){
    document.getElementById("modal").style.display="none"

})

getDeckBtnDom.addEventListener("click", getDeck)//When clicked the btn, get the deck from the api

getCardsBtnDom.addEventListener("click",getCards)










