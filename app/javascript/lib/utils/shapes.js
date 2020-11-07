import PropTypes from 'prop-types'

export const avatarShape = PropTypes.shape({
  topType: PropTypes.string,
  accessoriesType: PropTypes.string,
  hairColor: PropTypes.string,
  facialHairType: PropTypes.string,
  facialHairColor: PropTypes.string,
  clotheType: PropTypes.string,
  clotheColor: PropTypes.string,
  graphicType: PropTypes.string,
  eyeType: PropTypes.string,
  eyebrowType: PropTypes.string,
  mouthType: PropTypes.string,
  skinColor: PropTypes.string
})

const topicShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
})

export const reflectionShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  topic: topicShape,
  zone: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  revealed: PropTypes.bool,
  content: PropTypes.string.isRequired,
  owner: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired
  }).isRequired
})

export const reactionShape = PropTypes.shape({
  targetId: PropTypes.string,
})

export const historyShape = PropTypes.shape({
  push: PropTypes.func.isRequired,
  replace: PropTypes.func.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
})
