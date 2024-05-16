import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

//Copy tweetsData becouse its a const
let tweetsDataCopy = tweetsData

// localStorage.clear()

// Event listeners to all button
document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.trash){
        handleTrashClick(e.target.dataset.trash)
    }
    else if(e.target.id == 'reply-btn'){
        handleReplyBtnClick(e.target.dataset.replybtn)
    }
})
 
// Like button clicks function
function handleLikeClick(tweetId){ 
    // Search a cliked like button
    const targetTweetObj = tweetsDataCopy.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    // If isLiked TRUE: we decrease quantity by 1, if FALSE: we increase quantity by 1
    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    // Chage statement of isLiked, save to localstorage and render
    targetTweetObj.isLiked =!targetTweetObj.isLiked
    saveToLocalStorage()
    getFeedHtml()
}

// Retweet button clicks function
function handleRetweetClick(tweetId){
    // Search a cliked retweet button
    const targetTweetObj = tweetsDataCopy.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    // If isRetweeted TRUE: we decrease quantity by 1, if FALSE: we increase quantity by 1
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    // Chage statement of isRetweeted, save to localstorage and render
    targetTweetObj.isRetweeted =!targetTweetObj.isRetweeted
    saveToLocalStorage()
    getFeedHtml() 
}

// Reply button clicks function
function handleReplyClick(replyId){
    // Disable hidden class of reply elements
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

// Add new tweet button function
function handleTweetBtnClick(){
    // Get tweet input field
    const tweetInput = document.getElementById('tweet-input')
    // If input field has some value
    if(tweetInput.value){
        // Push a new object to a array
        tweetsDataCopy.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    // Save to local storage, run function to render and clear input field
    localStorage.setItem( "feedInLocalStorage", JSON.stringify(tweetsDataCopy))
    getFeedHtml()
    tweetInput.value = ''
    }
}

// Delite tweet button function
function handleTrashClick(trashId) {
    // Get array of objects from local storage
    let arrOfData = JSON.parse(localStorage.getItem('feedInLocalStorage'))
    // Search a object in array to make a chages
    const tweetToRemove = arrOfData.find(function(tweet){
        return tweet.uuid === trashId
    })
    // If object found we delite it from array
    if (tweetToRemove) {
        const index = arrOfData.indexOf(tweetToRemove)
        arrOfData.splice(index, 1);
    }
    // // Save changes to a local storage, run function to render
    localStorage.setItem( "feedInLocalStorage", JSON.stringify(arrOfData))
    getFeedHtml()
}

// Add reply button function
function handleReplyBtnClick(tweetId) {
    // Get reply input that we needed
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    let arrOfData = tweetsDataCopy
    // If input field has some value
    if (replyInput.value){
        // Search a object in array to make a chages
        const selectedTweet = arrOfData.find(function(tweet){
            return tweet.uuid === tweetId
        })
        // Push a new reply object to reply array of this object
        selectedTweet.replies.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: replyInput.value,
        })
        // Save changes to a local storage, run function to render and clear input field
        localStorage.setItem( "feedInLocalStorage", JSON.stringify(arrOfData))
        getFeedHtml()
        replyInput.value = ''
    }
    
}

// Render all tweets 
function getFeedHtml(){
    // Get array from local storage
    let feedFromLocalStorage = JSON.parse(localStorage.getItem('feedInLocalStorage'))
    if (feedFromLocalStorage) {
        tweetsDataCopy = feedFromLocalStorage
    } 

    let feedHtml = ''
    
    tweetsDataCopy.forEach(function(tweet){
        // Сheck statement and change class for icons
        let likeIconClass = ''
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        if (tweet.isRetweeted){
            retweetIconClass = 'etweeted'
        }
        // Prepare replies for render 
        let repliesHtml = ''
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${reply.handle}</p>
            <p class="tweet-text">${reply.tweetText} </p>
        </div>
    </div>
</div>
                `
            })
        }
        // Prepare tweets for render
        feedHtml += `
<div class="tweet" id="id-${tweet.uuid}">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}" data-like="${tweet.uuid}"></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}" data-retweet="${tweet.uuid}"></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-trash" data-trash="${tweet.uuid}"></i>
                </span>
            </div>
        </div>
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
    <div class="tweet-reply">
        <div class="tweet-inner">
            <img src="images/scrimbalogo.png" class="profile-pic">
            <textarea placeholder="Reply" id="reply-input-${tweet.uuid}" class="reply-textarea"'></textarea>
        </div>
        <button id="reply-btn" class="reply-button" data-replybtn='${tweet.uuid}'>Reply</button>
    </div>
    </div>
</div>
        `
    })
    // Save to local storage and render all tweets
    saveToLocalStorage()
    document.getElementById('feed').innerHTML = feedHtml
    
}

// Run render function
getFeedHtml()

// Save to local storage
function saveToLocalStorage(){
    localStorage.setItem('feedInLocalStorage', JSON.stringify(tweetsDataCopy));
}
