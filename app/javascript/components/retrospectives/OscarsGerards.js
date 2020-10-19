import React from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import PropTypes from 'prop-types'
import Zone from './Zone'
import StickyNote from '../StickyNote'
import Icon from '../Icon'
import './OscarsGerards.scss'

const OscarsGerards = ({ highlightZones, onZoneClicked }) => {
  const reflections = useSelector(state => state.reflections.ownReflections, shallowEqual)
  const zones = useSelector(state => state.retrospective.zones, shallowEqual)
  const currentStep = useSelector(state => state.orchestrator.step)

  const bestTicket = zones.find((zone) => zone.name === 'Best ticket')
  const worstTicket = zones.find((zone) => zone.name === 'Worst ticket')
  const bestLearning = zones.find((zone) => zone.name === 'Best learning')
  const bestEvent = zones.find((zone) => zone.name === 'Best event')
  const worstEvent = zones.find((zone) => zone.name === 'Worst event')
  const bestPerson = zones.find((zone) => zone.name === 'Best person')
  const bestQuote = zones.find((zone) => zone.name === 'Best quote')
  const worstQuote = zones.find((zone) => zone.name === 'Worst quote')
  const greatestExpectation = zones.find((zone) => zone.name === 'Greatest expectation')
  const greatestFear = zones.find((zone) => zone.name === 'Greatest fear')

  const reflectionInBestTicket = reflections.filter((reflection) => reflection.zone.id === bestTicket.id)[0]
  const reflectionInWorstTicket = reflections.filter((reflection) => reflection.zone.id === worstTicket.id)[0]
  const reflectionInBestLearning = reflections.filter((reflection) => reflection.zone.id === bestLearning.id)[0]
  const reflectionInBestEvent = reflections.filter((reflection) => reflection.zone.id === bestEvent.id)[0]
  const reflectionInWorstEvent = reflections.filter((reflection) => reflection.zone.id === worstEvent.id)[0]
  const reflectionInBestPerson = reflections.filter((reflection) => reflection.zone.id === bestPerson.id)[0]
  const reflectionInBestQuote = reflections.filter((reflection) => reflection.zone.id === bestQuote.id)[0]
  const reflectionInWorstQuote = reflections.filter((reflection) => reflection.zone.id === worstQuote.id)[0]
  const reflectionInGreatestExpectation = reflections.filter((reflection) => reflection.zone.id === greatestExpectation.id)[0]
  const reflectionInGreatestFear = reflections.filter((reflection) => reflection.zone.id === greatestFear.id)[0]

  return (
    <>
      <div className='flex flex-1 w-full'>
        <Zone
          reference={bestTicket}
          hideCount
          highlight={!reflectionInBestTicket ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Best ticket' dataAttributes={{ 'data-id': bestTicket.id }} onClick={!reflectionInBestTicket ? onZoneClicked : null} />}
          reflections={[reflectionInBestTicket]}
          onClick={!reflectionInBestTicket ? onZoneClicked : null}>
          {reflectionInBestTicket && <StickyNote key={reflectionInBestTicket.id} reflection={reflectionInBestTicket} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={bestEvent}
          hideCount
          highlight={!reflectionInBestEvent ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Best event' dataAttributes={{ 'data-id': bestEvent.id }} onClick={!reflectionInBestEvent ? onZoneClicked : null} />}
          reflections={[reflectionInBestEvent]}
          onClick={!reflectionInBestEvent ? onZoneClicked : null}>
          {reflectionInBestEvent && <StickyNote key={reflectionInBestEvent.id} reflection={reflectionInBestEvent} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={bestLearning}
          hideCount
          highlight={!reflectionInBestLearning ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Best learning' dataAttributes={{ 'data-id': bestLearning.id }} onClick={!reflectionInBestLearning ? onZoneClicked : null} />}
          reflections={[reflectionInBestLearning]}
          onClick={!reflectionInBestLearning ? onZoneClicked : null}>
          {reflectionInBestLearning && <StickyNote key={reflectionInBestLearning.id} reflection={reflectionInBestLearning} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={bestQuote}
          hideCount
          highlight={!reflectionInBestQuote ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Best quote' dataAttributes={{ 'data-id': bestQuote.id }} onClick={!reflectionInBestQuote ? onZoneClicked : null} />}
          reflections={[reflectionInBestQuote]}
          onClick={!reflectionInBestQuote ? onZoneClicked : null}>
          {reflectionInBestQuote && <StickyNote key={reflectionInBestQuote.id} reflection={reflectionInBestQuote} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={greatestExpectation}
          hideCount
          highlight={!reflectionInGreatestExpectation ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Greatest expectation' dataAttributes={{ 'data-id': greatestExpectation.id }} onClick={!reflectionInGreatestExpectation ? onZoneClicked : null} />}
          reflections={[reflectionInGreatestExpectation]}
          onClick={!reflectionInGreatestExpectation ? onZoneClicked : null}>
          {reflectionInGreatestExpectation && <StickyNote key={reflectionInGreatestExpectation.id} reflection={reflectionInGreatestExpectation} readOnly={currentStep !== 'thinking'} />}
        </Zone>
      </div>
      <div className='flex flex-1 w-full pb-12'>
        <Zone
          reference={worstTicket}
          hideCount
          highlight={!reflectionInWorstTicket ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Worst ticket' dataAttributes={{ 'data-id': worstTicket.id }} onClick={!reflectionInWorstTicket ? onZoneClicked : null} />}
          reflections={[reflectionInWorstTicket]}
          onClick={!reflectionInWorstTicket ? onZoneClicked : null}>
          {reflectionInWorstTicket && <StickyNote key={reflectionInWorstTicket.id} reflection={reflectionInWorstTicket} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={worstEvent}
          hideCount
          highlight={!reflectionInWorstEvent ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Worst event' dataAttributes={{ 'data-id': worstEvent.id }} onClick={!reflectionInWorstEvent ? onZoneClicked : null} />}
          reflections={[reflectionInWorstEvent]}
          onClick={!reflectionInWorstEvent ? onZoneClicked : null}>
          {reflectionInWorstEvent && <StickyNote key={reflectionInWorstEvent.id} reflection={reflectionInWorstEvent} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={bestPerson}
          hideCount
          highlight={!reflectionInBestPerson ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Best person' dataAttributes={{ 'data-id': bestPerson.id }} onClick={!reflectionInBestPerson ? onZoneClicked : null} />}
          reflections={[reflectionInBestPerson]}
          onClick={!reflectionInBestPerson ? onZoneClicked : null}>
          {reflectionInBestPerson && <StickyNote key={reflectionInBestPerson.id} reflection={reflectionInBestPerson} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={worstQuote}
          hideCount
          highlight={!reflectionInWorstQuote ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Worst quote' dataAttributes={{ 'data-id': worstQuote.id }} onClick={!reflectionInWorstQuote ? onZoneClicked : null} />}
          reflections={[reflectionInWorstQuote]}
          onClick={!reflectionInWorstQuote ? onZoneClicked : null}>
          {reflectionInWorstQuote && <StickyNote key={reflectionInWorstQuote.id} reflection={reflectionInWorstQuote} readOnly={currentStep !== 'thinking'} />}
        </Zone>
        <Zone
          reference={greatestFear}
          hideCount
          highlight={!reflectionInGreatestFear ? highlightZones : null}
          icon={<Icon retrospectiveKind='oscars_gerards' zone='Greatest fear' dataAttributes={{ 'data-id': greatestFear.id }} onClick={!reflectionInGreatestFear ? onZoneClicked : null} />}
          reflections={[reflectionInGreatestFear]}
          onClick={!reflectionInGreatestFear ? onZoneClicked : null}>
          {reflectionInGreatestFear && <StickyNote key={reflectionInGreatestFear.id} reflection={reflectionInGreatestFear} readOnly={currentStep !== 'thinking'} />}
        </Zone>
      </div>
    </>
  )
}

OscarsGerards.propTypes = {
  highlightZones: PropTypes.bool,
  onZoneClicked: PropTypes.func.isRequired
}

export default OscarsGerards
