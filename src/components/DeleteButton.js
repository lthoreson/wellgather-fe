import { useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { Button, Confirm, Icon, Popup } from 'semantic-ui-react'
import { DELETE_COMMENT_MUTATION, DELETE_POST_MUTATION, FETCH_POSTS_QUERY } from '../util/graphQL'
import MyPopup from './MyPopup'

export default function DeleteButton({ postId, commentId, callback }) {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePostOrComment] = useMutation(mutation, {
        update(proxy) {
            setConfirmOpen(false)
            if (!commentId) {
                const data = JSON.parse(JSON.stringify(proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })))
                data.getPosts = data.getPosts.filter(p => p.id !== postId)
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data
                })
            }
            if (callback) { callback() }
        },
        variables: {
            postId,
            commentId
        }
    })

    return (
        <>
            <MyPopup content={commentId ? 'Delete comment' : 'Delete post'}>
                <Button as='div' color='red' onClick={() => setConfirmOpen(true)} floated='right'>
                    <Icon name='trash' style={{ margin: 0 }} />
                </Button>
            </MyPopup>
            <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostOrComment} />
        </>
    )
}
