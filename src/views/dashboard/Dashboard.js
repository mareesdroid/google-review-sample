import React, { useEffect, useState } from 'react'

import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardLink,
  CCardSubtitle,
  CCardText,
  CCardTitle,
  CForm,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import sampleReviews from '../../json/sampleReviews.json'
import sampleResponse from '../../json/sampleResponse.json'


const Dashboard = () => {
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [autoReply, setAutoReply] = useState(false)
  const [selectedReply, setSelectedReply] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [commentResponse, setCommentResponse] = useState(null)
  const [input, setInput] = useState({
    packageName: '',
    authToken: ''
  })
  const [environment, setEnvironment] = useState('test')



  useEffect(() => {
    console.log(selected)
  }, [selected])

  const handleFetchReviews = () => {
    if (environment === 'test') {
      setShowComments(true)
    } else {
      fetch(`https://www.googleapis.com/androidpublisher/v3/applications/${input.packageName}/reviews?
      access_token=${input.authToken}`)
        .then((response) => response.json())
        .then((data) => setCommentResponse(data));
    }
  }

  const handleInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <CButtonGroup role="group" aria-label="Basic outlined example">
        <CButton onClick={() => {
          setEnvironment('test')
          setShowComments(false)
        }} color="primary" variant={environment !== 'test' && "outline"}>
          Test
        </CButton>
        <CButton onClick={() => {
          setEnvironment('demo')
          setShowComments(false)
        }} color="primary" variant={environment !== 'demo' && "outline"}>
          Demo
        </CButton>
      </CButtonGroup>
      <form>
        <div className="form-group">
          <div>
            <label htmlFor="exampleInputEmail1">App package name</label>
            <input type="text" name="packageName" onChange={handleInput} value={input.packageName} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="com.yourapp.package.here" />
            <small id="emailHelp" className="form-text text-muted">Input your app package name here.</small>
          </div>
          <div>
            <label htmlFor="exampleInputEmail1">Auth token</label>
            <input type="text" name="authToken" onChange={handleInput} value={input.authToken} className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Auth token" />
            <small id="emailHelp" className="form-text text-muted">Input your auth token here.</small>
          </div>
          <CButton onClick={handleFetchReviews} color='primary'>Fetch Reviews</CButton>
        </div>
      </form>
      {
        commentResponse && environment === 'demo' && 'reviews' in commentResponse && commentResponse.reviews.map(d => (
          <CCard key={d.reviewId} style={{}}>
            <CCardBody>
              <CCardTitle>{d.authorName}</CCardTitle>
              <CCardSubtitle className="mb-2 text-medium-emphasis">Card subtitle</CCardSubtitle>
              <CCardText>
                {
                  d.comments.map(e => (
                    Object.keys(e).map((f, i) => (
                      <>
                        <ul key={i}>
                          <li>{f}</li>
                        </ul>
                        <p>{e[f].text}</p>
                      </>
                    ))
                  ))
                }
              </CCardText>
              <CCardLink onClick={() => {
                setSelected({
                  authorName: d.authorName,
                  comment: d.comments[d.comments.length - 1]
                })
                setVisible(!visible)
              }}>Reply</CCardLink>
            </CCardBody>
          </CCard>
        ))
      }
      {
        showComments && sampleReviews.map(d => (
          <CCard key={d.reviewId} style={{}}>
            <CCardBody>
              <CCardTitle>{d.authorName}</CCardTitle>
              <CCardSubtitle className="mb-2 text-medium-emphasis">Card subtitle</CCardSubtitle>
              <CCardText>
                {
                  d.comments.map(e => (
                    Object.keys(e).map((f, i) => (
                      <>
                        <ul key={i}>
                          <li>{f}</li>
                        </ul>
                        <p>{e[f].text}</p>
                      </>
                    ))
                  ))
                }
              </CCardText>
              <CCardLink onClick={() => {
                setSelected({
                  authorName: d.authorName,
                  comment: d.comments[d.comments.length - 1]
                })
                setVisible(!visible)
              }}>Reply</CCardLink>
            </CCardBody>
          </CCard>
        ))
      }


      <>
        <CModal visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Reply To {selected && selected.authorName}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div style={{ display: 'flex', padding: '1rem', flexDirection: 'row', justifyContent: 'space-between' }}>
              {selected && selected.comment[Object.keys(selected.comment)[0]].text}
              <CButton onClick={() => setAutoReply(!autoReply)}>
                Auto Reply
              </CButton>
            </div>
            {autoReply ? <>
              {sampleResponse.map((d, i) => (
                <CCard color={selectedReply === i && 'primary'} onClick={() => setSelectedReply(i)} style={{ cursor: 'pointer' }} key={i}>
                  <CCardBody>
                    <p style={{ color: selectedReply === i && '#fff' }}>{d}</p>
                  </CCardBody>
                </CCard>
              ))}
            </> : <CForm>
              <CFormTextarea
                id="exampleFormControlTextarea1"
                rows={3}
                text="Must be 8-20 words long."
              ></CFormTextarea>
            </CForm>}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Close
            </CButton>
            <CButton color="primary">Send</CButton>
          </CModalFooter>
        </CModal>
      </>

    </>

  )
}

export default Dashboard
