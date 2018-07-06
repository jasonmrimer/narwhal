import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { WebRepositories } from '../../utils/Repositories';
import { CertificationFormStore } from '../../skills/certification/stores/CertificationFormStore';
import { StyledTopBar } from '../../widgets/TopBar';
import { StyledCertificationForm } from '../../skills/certification/CertificationForm';

interface Props {
  certificationFormStore?: CertificationFormStore;
  certificationId?: number;
  history?: any;
}

@inject('certificationFormStore')
@observer
export class CertificationManagerPage extends React.Component<Props> {
  async componentDidMount() {
    await this.props.certificationFormStore!.performLoading(async () => {
      const {certificationId} = this.props;
      const certification = certificationId
        ? await WebRepositories.certificationRepository.findOneCertification(certificationId!)
        : {title: ''};
      this.props.certificationFormStore!.hydrate(certification);
    });
  }

  render() {
    const {history} = this.props;
    return (
      <React.Fragment>
        <StyledTopBar history={history}/>
        <StyledCertificationForm history={history}/>
      </React.Fragment>
    );
  }
}