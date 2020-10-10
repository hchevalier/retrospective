import React from 'react'
import PropTypes from 'prop-types'
import { post } from 'lib/httpClient'
import Modal from './Modal'
import Button from './Button'
import LinkIcon from 'images/link-icon.svg'

const copyUrlToClipboard = () => {
  const toCopy = document.createElement('span')
  toCopy.setAttribute('type', 'hidden')
  toCopy.appendChild(document.createTextNode(window.location.href))
  document.body.appendChild(toCopy);
  const range = document.createRange()
  const selection = window.getSelection()

  range.selectNodeContents(toCopy)
  selection.removeAllRanges()
  selection.addRange(range)
  document.execCommand('copy')
  selection.removeAllRanges()

  toCopy.remove()
  alert('Copied invite URL to clipboard')
}

const AddGroupMembersModal = ({ group, onInvitationsSent, onModalClose, retrospectiveId, visible, withGroupMembers, withShareableLink }) => {
  const [emails, setEmails] = React.useState('')

  const handleSendInvitations = () => {
    post({
      url: `/api/groups/${group.id}/pending_invitations`,
      payload: {
        retrospective_id: retrospectiveId,
        emails: emails
      }
    })
      .then(onInvitationsSent)
      .catch(error => console.warn(error))
  }

  const handleEmailsChange = (event) => setEmails(event.target.value)

  return (
    <Modal open={visible} onClose={onModalClose}>
      <div>
        {withGroupMembers && (
          <>
            <div className='font-bold'>Group members</div>
            <div className='mb-4'>
              {group.members.map((member) => <div key={member.id}>{member.username}</div>)}
            </div>
          </>
        )}

        <textarea
          className='w-full border p-2 resize-none'
          name='email_addresses'
          rows='3'
          placeholder={`Enter email addresses of people you want to add to ${group.name}, separated with comas`}
          value={emails}
          onChange={handleEmailsChange} />
        <Button primary contained className='mt-2' onClick={handleSendInvitations}>Send invitations</Button>

        {withShareableLink && (
          <div className='mt-4'>
            <div>You can seend this link to people already member of the group:</div>
            <div className='flex flex-row flex-no-wrap rounded-full border'>
              <div className='border-r p-2'><img src={LinkIcon} className='inline' width="24" /></div>
              <div className='overflow-x-scroll p-2 whitespace-no-wrap'>{window.location.href}</div>
              <div className='border-l py-2 px-4 bg-blue-500 hover:bg-blue-700 rounded-r-full text-white cursor-pointer' onClick={copyUrlToClipboard}>Copy</div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

AddGroupMembersModal.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onInvitationsSent: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired,
  retrospectiveId: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  withGroupMembers: PropTypes.bool,
  withShareableLink: PropTypes.bool
}


export default AddGroupMembersModal
