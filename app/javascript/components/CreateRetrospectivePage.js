import React from "react"
import PropTypes from "prop-types"

class CreateRetrospectivePage extends React.Component {
  render () {
    const { kinds } = this.props

    return (
      <div>
        You:
        <input type='text' name='surname' placeholder='Surname' />
        <input type='text' name='email' placeholder='Email' />

        The retrospective
        <input type='text' name='retrospective_name' placeholder='Team name' />
        <select name='retropsective_kind'>
          {kinds.map((kind, index) => <option key={index} value={kind}>{kind}</option>)}
        </select>
      </div>
    )
  }
}

// TODO: PropTypes.kinds

export default CreateRetrospectivePage
