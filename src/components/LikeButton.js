import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Label } from 'semantic-ui-react'
import { LIKE_POST_MUTATION } from '../util/graphQL'
import MyPopup from './MyPopup'

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
    const [liked, setLiked] = useState(false)
    useEffect(() => {
        if (user && likes.find((like) => like.username === user.username)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    })

    const likeButton = user ? (
        liked ? (
            <Button color='violet'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='violet' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
        <Button as={Link} to='/login' color='violet' basic>
            <Icon name='heart' />
        </Button>
    )
    return (
        <MyPopup content={liked ? 'Unlike' : 'Like'}>
            <Button as='div' labelPosition='right' onClick={likePost}>
                {likeButton}
                <Label as='a' basic color='violet' pointing='left'>
                    {likeCount}
                </Label>
            </Button>
        </MyPopup>
    )
}
