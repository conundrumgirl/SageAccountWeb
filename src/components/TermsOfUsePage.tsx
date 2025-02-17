import React, { useState } from 'react'
import { SynapseClient } from 'synapse-react-client'
import IconSvg from 'synapse-react-client/dist/containers/IconSvg'
import TermsAndConditions from 'synapse-react-client/dist/containers/TermsAndConditions'
import { displayToast } from 'synapse-react-client/dist/containers/ToastMessage'
import { useSynapseContext } from 'synapse-react-client/dist/utils/SynapseContext'
import { useSourceApp, SourceAppLogo } from './SourceApp'
import { Button, Link } from '@mui/material'

export type TermsOfUsePageProps = {}

export const TermsOfUsePage = (props: TermsOfUsePageProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isFormComplete, setIsFormComplete] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const { accessToken } = useSynapseContext()
  const sourceApp = useSourceApp()
  const sourceAppName = sourceApp?.friendlyName

  const tcAgreement =
    'https://s3.amazonaws.com/static.synapse.org/governance/SageBionetworksSynapseTermsandConditionsofUse.pdf'
  const onSignTermsOfUse = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      if (accessToken) {
        SynapseClient.signSynapseTermsOfUse(accessToken)
          .then(() => {
            setIsDone(true)
          })
          .catch((err: any) => {
            displayToast(err.reason as string, 'danger')
          })
      }
    } catch (err: any) {
      displayToast(err.reason as string, 'danger')
    } finally {
      setIsLoading(false)
    }
  }

  const buttonSx = {
    width: '100%',
    padding: '10px',
  }

  if (isDone) {
    // AppInitializer still thinks the ToU are not signed.
    if (sourceApp?.requestAffiliation) {
      window.location.assign('/authenticated/currentaffiliation')
    } else {
      window.location.assign('/authenticated/accountcreated')
    }
  }
  return (
    <>
      <div className={'panel-wrapper-bg TermsOfUsePage'}>
        <div className={'panel-wrapper with-white-panel-bg'}>
          <div className={'panel-left'}>
            <div className={'panel-logo'}>
              <SourceAppLogo />
            </div>
            <div className={'terms-of-use-panel'}>
              <TermsAndConditions
                onFormChange={(completed: boolean) => {
                  setIsFormComplete(completed)
                }}
                // Once SRC version is updated uncomment below
                // hideLinkToFullTC
              />
              <Button
                sx={buttonSx}
                variant="contained"
                onClick={onSignTermsOfUse}
                disabled={isLoading || !isFormComplete}
              >
                Accept and Continue <IconSvg icon="arrowForward" />
              </Button>
              <Button
                sx={buttonSx}
                variant="text"
                href={tcAgreement}
                target="_blank"
              >
                View and Complete Terms and Conditions for Use
              </Button>
            </div>
          </div>
          <div className={'panel-right'}>
            <div className={'right-panel-text'}>
              <h4>What is the Sage Pledge</h4>
              <p>
                {sourceAppName} is powered by{' '}
                <Link href={'https://sagebionetworks.org/'} target="_blank">
                  Sage Bionetworks
                </Link>
                , and follows the Sage Governance polices.
              </p>
              <p>
                To ensure secure and confidential access to data, we ask all
                account holders to affirm their agreement with our governance
                policies before finishing registration.
              </p>
              <p>
                If you have questions, please contact{' '}
                <Link href={'mailto:act@sagebionetworks.org'}>
                  act@sagebionetworks.org
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
