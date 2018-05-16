import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { WebRepositories } from '../../utils/Repositories';
import { CertificationFormStore } from '../../skills/certification/stores/CertificationFormStore';
import { StyledTopBar } from '../../widgets/TopBar';
import { StyledCertificationForm } from '../../skills/certification/CertificationForm';

interface Props {
  certificationFormStore?: CertificationFormStore;
  certificationId?: number;
}

@inject('certificationFormStore')
@observer
export class CertificationManagerPage extends React.Component<Props> {
  async componentDidMount() {
    await this.props.certificationFormStore!.performLoading(async () => {
      const certification =
        await WebRepositories.certificationRepository.findOneCertification(this.props.certificationId!);
      this.props.certificationFormStore!.hydrate(certification);
    });
  }

  render() {
    return (
      <React.Fragment>
        <StyledTopBar/>
        <StyledCertificationForm/>
      </React.Fragment>
    );
  }
}