import React from 'react'

const Notification = ({ msg, type }) => {
  if (msg === null || type === null) return null

  if (type === 'notif') {
    return (
      <div className="notif">
        {msg}
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="notifError">
        {msg}
      </div>
    )
  }
}

export default Notification