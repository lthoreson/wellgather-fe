import { useMutation, useQuery } from '@apollo/client'
import moment from 'moment'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardContent, Form, Grid, Icon, Image, Label } from 'semantic-ui-react'
import DeleteButton from '../components/DeleteButton'
import LikeButton from '../components/LikeButton'
import MyPopup from '../components/MyPopup'
import { AuthContext } from '../context/auth'
import { FETCH_POST_QUERY, SUBMIT_COMMENT_MUTATION } from '../util/graphQL'

export default function SinglePost(props) {
    const { postId } = useParams()
    const { user } = useContext(AuthContext)
    const commentInputRef = useRef(null)
    const [comment, setComment] = useState('')
    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    })
    const navigate = useNavigate()

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            commentInputRef.current.blur()
        },
        variables: {
            postId,
            body: comment
        }
    })

    function deletePostCallback() {
        navigate('/')
    }
    let postMarkup
    if (!getPost) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/molly.png' size='small' float='right' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{ id, likeCount, likes }} />
                                <MyPopup content='Comment on post'>
                                    <Button as='div' labelPosition='right' onClick={console.log('Comment on post')}>
                                        <Button basic color='purple'>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label basic color='purple' pointing='left'>{commentCount}</Label>
                                    </Button>
                                </MyPopup>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback} />
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <CardContent>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <input type='text' placeholder='comment...' name='comment' value={comment} onChange={event => setComment(event.target.value)} ref={commentInputRef} />
                                            <button type='submit' className='ui button violet' disabled={comment.trim() === ''} onClick={submitComment}>Submit</button>
                                        </div>
                                    </Form>
                                </CardContent>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={comment.id}>
                                <CardContent>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </CardContent>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    return (
        postMarkup
    )
}
