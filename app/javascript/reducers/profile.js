const DEFAULT_STATE = {
  avatar: {
    topType: 'LongHairMiaWallace',
    accessoriesType: 'Blank',
    hairColor: 'BrownDark',
    facialHairType: 'Blank',
    facialHairColor: 'Auburn',
    clotheType: 'GraphicShirt',
    clotheColor: 'PastelBlue',
    graphicType: 'Diamond',
    eyeType: 'Happy',
    eyebrowType: 'Default',
    mouthType: 'Smile',
    skinColor: 'Light'
  }
}

const profile = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'login':
      return action.profile;
    case 'change-color':
    case 'change-avatar':
    case 'refresh-participant':
      if (state.uuid === action.participant.uuid)
        return { ...state, ...action.participant }
      else
        return state
    default:
      return state
  }
}
export default profile
