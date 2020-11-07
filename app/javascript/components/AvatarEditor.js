import React from 'react'
import Avatar, { Piece } from 'avataaars'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { put } from 'lib/httpClient'
import { avatarShape } from 'lib/utils/shapes'
import {
  TYPE_MAPPING, SKIN_COLORS, TOPS_HAT, TOPS_LONG, TOPS_SHORT, TOPS_COLORS, CLOTHES, CLOTHES_COLORS, GRAPHICS,
  FACIAL_HAIR, FACIAL_HAIR_COLORS, ACCESSORIES, EYES, EYEBROWS, MOUTHS
} from 'utils/constants/avatar'

const PieceWrapper = ({ pieceType, value, pieceData, onItemSelect }) => {
  const additionalStyle = {}
  const color = ['clothe-color', 'hair-color', 'facial-hair-color', 'skin', 'graphics'].includes(pieceType)
  if (color) additionalStyle.backgroundColor = pieceData.background
  const pieceSize = ['clothe-color', 'hair-color', 'facial-hair-color'].includes(pieceType) ? '50' : '100'

  return (
    <div id={`${pieceType}-${value}`} className={classNames('border cursor-pointer', { 'max-h-16': pieceSize === '50' })} onClick={() => onItemSelect(TYPE_MAPPING[pieceType], value)} style={additionalStyle}>
      <Piece pieceType={pieceType} pieceSize={pieceSize} {...pieceData} />
    </div>
  )
}

PieceWrapper.propTypes = {
  pieceType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  pieceData: PropTypes.shape({
    background: PropTypes.string
  }),
  onItemSelect: PropTypes.func.isRequired
}

const SkinTab = ({ onItemSelect }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {Object.entries(SKIN_COLORS).map(([skinColorName, skinColor]) => {
        return (
          <PieceWrapper
            key={skinColorName}
            pieceType='skin'
            value={skinColorName}
            pieceData={{ skinColor: skinColorName, background: skinColor }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

SkinTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired
}

const FacialHairTab = ({ onItemSelect, currentColor }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {FACIAL_HAIR.map((facialHair) => {
        return (
          <PieceWrapper
            key={facialHair}
            pieceType='facialHair'
            value={facialHair}
            pieceData={{ facialHairType: facialHair, facialHairColor: currentColor }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
    <div className='flex flex-row flex-wrap content-start'>
      {Object.entries(FACIAL_HAIR_COLORS).map(([facialHairColorName, facialHairColor]) => {
        return (
          <PieceWrapper
            key={facialHairColorName}
            pieceType='facial-hair-color'
            value={facialHairColorName}
            pieceData={{ facialHairColor: facialHairColorName, background: facialHairColor }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

FacialHairTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired,
  currentColor: PropTypes.string
}

const EyesTab = ({ onItemSelect }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {EYES.map((eyeType) => {
        return (
          <PieceWrapper
            key={eyeType}
            pieceType='eyes'
            value={eyeType}
            pieceData={{ eyeType }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

EyesTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired
}

const EyebrowsTab = ({ onItemSelect }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {EYEBROWS.map((eyebrowType) => {
        return (
          <PieceWrapper
            key={eyebrowType}
            pieceType='eyebrows'
            value={eyebrowType}
            pieceData={{ eyebrowType }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

EyebrowsTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired
}

const MouthTab = ({ onItemSelect }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {MOUTHS.map((mouthType) => {
        return (
          <PieceWrapper
            key={mouthType}
            pieceType='mouth'
            value={mouthType}
            pieceData={{ mouthType }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

MouthTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired
}

const TopTab = ({ onItemSelect, currentColor }) => {
  const [tab, setTab] = React.useState('long')

  let list = TOPS_LONG
  if (tab === 'short') list = TOPS_SHORT
  if (tab === 'hats') list = TOPS_HAT

  return (
    <div className='flex flex-row'>
      <div className='flex flex-col w-3/4'>
        <div className='flex flex-row'>
          <TabEntry name='long' selected={tab === 'long'} label='Long hair' onClick={setTab} />
          <div className='mx-2' />
          <TabEntry name='short' selected={tab === 'short'} label='Short hair' onClick={setTab} />
          <div className='mx-2' />
          <TabEntry name='hats' selected={tab === 'hats'} label='Hats' onClick={setTab} />
        </div>
        <div className='flex flex-row'>
          <div className='flex flex-row flex-wrap'>
            {list.map((topType) => {
              return (
                <PieceWrapper
                  key={topType}
                  pieceType='top'
                  value={topType}
                  pieceData={{ topType, hairColor: currentColor }}
                  onItemSelect={onItemSelect} />
              )
            })}
          </div>
        </div>
      </div>
      <div className='flex flex-row flex-wrap w-1/4 content-start'>
        {tab !== 'hats' && Object.entries(TOPS_COLORS).map(([hairColorName, hairColor]) => {
          return (
            <PieceWrapper
              key={hairColorName}
              pieceType='hair-color'
              value={hairColorName}
              pieceData={{ hairColor: hairColorName, background: hairColor }}
              onItemSelect={onItemSelect} />
          )
        })}
      </div>
    </div>
  )
}

TopTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired,
  currentColor: PropTypes.string
}

const ClothesTab = ({ onItemSelect, currentColor }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {CLOTHES.map((clotheType) => {
        return (
          <PieceWrapper
            key={clotheType}
            pieceType='clothe'
            value={clotheType}
            pieceData={{ clotheType, clotheColor: currentColor }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
    <div className='flex flex-row flex-wrap content-start'>
      {Object.entries(CLOTHES_COLORS).map(([clotheColorName, clotheColor]) => {
        return (
          <PieceWrapper
            key={clotheColorName}
            pieceType='clothe-color'
            value={clotheColorName}
            pieceData={{ clotheColor: clotheColorName, background: clotheColor }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

ClothesTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired,
  currentColor: PropTypes.string
}

const ClothGraphicsTab = ({ onItemSelect, shirtColor }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {GRAPHICS.map((graphicType) => {
        return (
          <PieceWrapper
            key={graphicType}
            pieceType='graphics'
            value={graphicType}
            pieceData={{ graphicType, background: CLOTHES_COLORS[shirtColor] }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

ClothGraphicsTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired,
  shirtColor: PropTypes.string
}

const AccessoriesTab = ({ onItemSelect }) => (
  <div className='flex flex-row'>
    <div className='flex flex-row flex-wrap'>
      {ACCESSORIES.map((accessoriesType) => {
        return (
          <PieceWrapper
            key={accessoriesType}
            pieceType='accessories'
            value={accessoriesType}
            pieceData={{ accessoriesType }}
            onItemSelect={onItemSelect} />
        )
      })}
    </div>
  </div>
)

AccessoriesTab.propTypes = {
  onItemSelect: PropTypes.func.isRequired
}

const TabEntry = ({ name, label, disabled, selected, onClick }) => (
  <button
    className={
      classNames('px-2', {
        'cursor-pointer': !disabled,
        'text-gray-400 cursor-not-allowed': disabled,
        'bg-gray-200 font-medium': selected,
        'hover:bg-gray-100': !selected
      })
    }
    onClick={() => onClick(name)}>
      {label}
  </button>
)

TabEntry.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired
}

const AvatarEditor = ({ backgroundColor, settings, retrospectiveId }) => {
  const [currentTab, setCurrentTab] = React.useState('skin')

  const handleChangePiece = (itemType, value) => put({ url: `/api/account`, payload: { [itemType]: value, retrospective_id: retrospectiveId } })

  return (
    <div className='flex flex-row flex-grow w-full mt-2 p-2'>
      <div className='flex flex-col border'>
        <div id='editor-avatar-container' style={{ backgroundColor }}>
          <Avatar
            style={{ width: '96px', height: '96px' }}
            avatarStyle='Transparent'
            {...settings} />
        </div>
        <TabEntry name='skin' selected={currentTab === 'skin' } label='Skin color' onClick={setCurrentTab} />
        <TabEntry name='top' selected={currentTab === 'top' } label='Hair/Hat' onClick={setCurrentTab} />
        <TabEntry name='facial-hair' selected={currentTab === 'facial-hair' } label='Facial hair' onClick={setCurrentTab} />
        <TabEntry name='eyes' selected={currentTab === 'eyes' } label='Eyes' onClick={setCurrentTab} />
        <TabEntry name='eyebrows' selected={currentTab === 'eyebrows' } label='Eyebrows' onClick={setCurrentTab} />
        <TabEntry name='mouth' selected={currentTab === 'mouth' } label='Mouth' onClick={setCurrentTab} />
        <TabEntry name='clothes' selected={currentTab === 'clothes' } label='Clothes' onClick={setCurrentTab} />
        <TabEntry name='graphics' selected={currentTab === 'graphics' } label='Shirt logo' disabled={settings.clotheType !== 'GraphicShirt'} onClick={setCurrentTab} />
        <TabEntry name='accessories' selected={currentTab === 'accessories' } label='Accessories' onClick={setCurrentTab} />
      </div>
      <div className='flex flex-col flex-grow ml-2'>
        {currentTab === 'skin' && <SkinTab onItemSelect={handleChangePiece} />}
        {currentTab === 'top' && <TopTab onItemSelect={handleChangePiece} currentColor={settings.hairColor} />}
        {currentTab === 'facial-hair' && <FacialHairTab onItemSelect={handleChangePiece} currentColor={settings.facialHairColor} />}
        {currentTab === 'eyes' && <EyesTab onItemSelect={handleChangePiece} />}
        {currentTab === 'eyebrows' && <EyebrowsTab onItemSelect={handleChangePiece} />}
        {currentTab === 'mouth' && <MouthTab onItemSelect={handleChangePiece} />}
        {currentTab === 'clothes' && <ClothesTab onItemSelect={handleChangePiece} currentColor={settings.clotheColor} />}
        {currentTab === 'graphics' && <ClothGraphicsTab onItemSelect={handleChangePiece} shirtColor={settings.clotheColor} />}
        {currentTab === 'accessories' && <AccessoriesTab onItemSelect={handleChangePiece} />}
      </div>
    </div>
  )
}

AvatarEditor.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  settings: avatarShape.isRequired,
  retrospectiveId: PropTypes.number.isRequired
}

export default AvatarEditor
