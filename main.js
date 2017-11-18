const baseUrl = 'http://localhost:7852'
const api = path => fetch(baseUrl + path).then(response => response.json())
const mainViewEl = document.getElementById('view')
const showLoading = () => mainViewEl.innerHTML = 'Loading...'
const clearView = () => mainViewEl.innerHTML = ''

function navigateToTopStories() {
    showLoading()

    api('/top-stories').then(stories => {
        clearView()
        renderTopStoriesView(stories)
    })
}

function navigateToStory(storyId) {
    showLoading()

    Promise.all([
        api(`/stories/${storyId}`),
        api(`/stories/${storyId}/comments`)
    ]).then((results) => {
        clearView()
        renderStoryView(results[0], results[1])
    })
}

function renderTopStoriesView(stories) {
    stories.forEach(story => {
        mainViewEl.appendChild(createStoryListing(story))
    })
}

function createStoryListing(story) {
    const newStoryEl = document.createElement('a')

    newStoryEl.setAttribute('class', 'story-listing')
    newStoryEl.innerText = '\u25B2' + story.score + ' \u2014 ' + story.title
    newStoryEl.addEventListener('click', () => {
        navigateToStory(story.id)
    })

    return newStoryEl
}

function renderStoryView(story, comments) {
    mainViewEl.appendChild(createStoryHeading(story.title))
    mainViewEl.appendChild(createCommentsSection(comments))
}

function createStoryHeading(title) {
    const newHeadingEl = document.createElement('h1')

    newHeadingEl.innerText = title

    return newHeadingEl
}

function createCommentsSection(comments) {
    const commentsSectionEl = document.createElement('div')

    commentsSectionEl.setAttribute('class', 'comments')

    createComments(comments).forEach(commentEl => {
        commentsSectionEl.appendChild(commentEl)
    })

    return commentsSectionEl
}

function createComments(comments) {
    return comments.map(comment => {
        const commentEl = document.createElement('div')
        const commentTextEl = document.createElement('div')
        const repliesEl = document.createElement('div')

        commentEl.setAttribute('class', 'comment')
        commentTextEl.setAttribute('class', 'text')
        commentTextEl.innerHTML = comment.text
        repliesEl.setAttribute('class', 'replies')

        createComments(comment.replies).forEach(replyEl => {
            repliesEl.appendChild(replyEl)
        })

        commentEl.appendChild(commentTextEl)
        commentEl.appendChild(repliesEl)

        return commentEl
    })
}

// Initially "navigate" to top stories
navigateToTopStories()

/*
<div class="comments">
    <div class="comment">
        <div class="text">Comment</div>
        <div class="replies">
            <div class="comment">
                <div class="text">Reply to C</div>
                <div class="replies">
                    <div class="comment">
                        <div class="text">Reply to RtoC</div>
                        <div class="replies"></div>
                    </div>
                    <div class="comment">
                        <div class="text">Reply 2 to RtoC</div>
                        <div class="replies"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
*/