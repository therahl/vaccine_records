class Records extends React.Component{
  constructor(props){
    super(props);
    this.getUpdatedExpirationDates = this.getUpdatedExpirationDates.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.updateType = this.updateType.bind(this);
    this.addRecord = this.addRecord.bind(this);
    this.updateType = this.updateType.bind(this);
    this.handleEditCert = this.handleEditCert.bind(this);
    this.handleDeleteCert = this.handleDeleteCert.bind(this);
    this.handleNewVaccine = this.handleNewVaccine.bind(this);
    this.handleEditVaccine = this.handleEditVaccine.bind(this);
    this.handleDeleteVaccine = this.handleDeleteVaccine.bind(this);
    this.handleCertificationClick = this.handleCertificationClick.bind(this);
    this.handleVaccineClick = this.handleVaccineClick.bind(this);
    // this.sortByType = this.sortByType.bind(this);
    this.certificationRender = this.certificationRender.bind(this);
    this.vaccineRender = this.vaccineRender.bind(this);
    this.state = {
      certifications: this.props.certifications,
      expiring_certifications: this.props.expiring_certifications,
      expiring_vaccinations: this.props.expiring_vaccinations,
      vaccines: this.props.vaccines,
      showVaccines: false,
      vaccineNames: this.props.vaccine_names
     }
  }
  componentWillMount(){
    this.updateType();
  }
  getUpdatedExpirationDates(){
    $.ajax({
      url: '/expiring_certifications',
      method: 'GET',
      dataType: 'JSON'
    }).success(data => {
      this.setState({expiring_certifications: data});
    });
    $.ajax({
      url: '/expiring_vaccinations',
      method: 'GET',
      dataType: 'JSON'
    }).success(data => {
      this.setState({expiring_vaccinations: data});
    });
  }
  addRecord(records){
    this.setState({certifications: records.certifications});
    this.updateType();
    this.getUpdatedExpirationDates();
  }
  updateType(){
    let updatedTypes = [].concat.apply([], this.props.certification_types);
    this.state.certifications.map(n => {
      let type = n.certification_type
      let i = updatedTypes.indexOf(type);
      if(i !== -1 && type !== 'Degree' && type !== 'Other'){
        updatedTypes.splice(i, 1);
      }
    });
    this.setState({types: updatedTypes});
    this.activeCategories = [];
    for(let vaccine of this.state.vaccines){
      if(this.activeCategories.indexOf(vaccine.category) == -1){
        this.activeCategories.push(vaccine.category);
      }
    }
  }
  handleEditCert(record, data){
    let index = this.state.certifications.indexOf(record);
    let certifications = React.addons.update(this.state.certifications, { $splice: [[index, 1, data]] });
    this.setState({certifications: certifications});
    this.getUpdatedExpirationDates();
  }
  handleDeleteCert(record){
    let index = this.state.certifications.indexOf(record);
    let certifications = React.addons.update(this.state.certifications, { $splice: [[index, 1]] });
    this.setState({certifications: certifications});
    this.updateType();
    this.getUpdatedExpirationDates();
  }
  handleNewVaccine(vaccines){
    this.setState({vaccines: vaccines});
    this.updateType();
    this.getUpdatedExpirationDates();
  }
  handleEditVaccine(vaccine, data){
    let index = this.state.vaccines.indexOf(vaccine);
    let vaccines = React.addons.update(this.state.vaccines, { $splice: [[index, 1, data]]});
    this.setState({vaccines: vaccines});
    this.getUpdatedExpirationDates();
  }
  handleDeleteVaccine(vaccine){
    let index = this.state.vaccines.indexOf(vaccine);
    let vaccines = React.addons.update(this.state.vaccines, { $splice: [[index, 1]]});
    this.setState({vaccines: vaccines});
    this.updateType();
    this.getUpdatedExpirationDates();
  }
  handleCertificationClick(e){
    this.setState({showVaccines: false});
  }
  handleVaccineClick(e){
    this.setState({showVaccines: true});
  }
  // TODO sorting feature
  // sortByType(){
  //   let sorted = this.state.certifications.sort((a, b) => {
  //     if (a.certification_type > b.certification_type) {
  //       return 1;
  //     }
  //     if (a.certification_type < b.certification_type) {
  //       return -1;
  //     }
  //     return 0;
  //   });
  //   this.setState({certifications: sorted});
  // }
  certificationRender(){
    let tableData = [];
    for(let record of this.state.certifications){
      tableData.push(<CertificationRecord key={record.id} handleDeleteCert={this.handleDeleteCert} record={record} handleEditCert={this.handleEditCert} />);
    }
    return(
      <div>
        <CertificationRecordForm handleNewRecord={this.addRecord} types={this.state.types} />
        <div className="col-md-8">
          <p className="lead text-center">Current Certifications</p>
          <table className="table table-responsive table-hover top-twenty header-fixed">
            <thead>
              <th>Type</th>
              <th>Expiration</th>
              <th>Name</th>
              <th>&nbsp;</th>
            </thead>
            <tbody>
              {tableData}
            </tbody>
          </table>
        </div>
        <div className="clearfix"></div>
        <div className="col-md-3 top-twenty">
          <ExpirationPanel key='expired' title="Expired" expiration={this.state.expiring_certifications.expired} />
        </div>
        <div className="col-md-3 top-twenty">
          <ExpirationPanel key='expire30' title="Expiring in 30 days" expiration={this.state.expiring_certifications.exp_30} />
        </div>
        <div className="col-md-3 top-twenty">
          <ExpirationPanel key='expire60' title="Expiring in 60 days" expiration={this.state.expiring_certifications.exp_60} />
        </div>
        <div className="col-md-3 top-twenty">
          <ExpirationPanel key='expire90' title="Expiring in 90 days" expiration={this.state.expiring_certifications.exp_90} />
        </div>
      </div>
    );
  }
  vaccineRender(){
    let tableData = [];
    for(let record of this.state.vaccines){
      tableData.push(<VaccinationRecord key={record.id} handleDeleteVaccine={this.handleDeleteVaccine} record={record} handleEditVaccine={this.handleEditVaccine} />);
    }

    return(
      <div>
        <VaccineForm key={this.state.vaccines.length} serviceHistoryid={this.props.service_history_id} handleNewVaccine={this.handleNewVaccine} categories={this.props.vaccine_categories} names={this.state.vaccineNames} />
        <div className="col-md-8">
          <p className="lead text-center">Current Vaccinations</p>
          <table className="table table-responsive table-hover top-twenty header-fixed">
            <thead>
              <th>Name</th>
              <th>Administration</th>
              <th>Expiration</th>
              <th>&nbsp;</th>
            </thead>
            <tbody>
              {tableData}
            </tbody>
          </table>
        </div>
        <div className="clearfix"></div>
        <div className="col-md-3 top-twenty">
          <VaccineExpirationPanel key='expired' title="Expired" expiration={this.state.expiring_vaccinations.expired} />
        </div>
        <div className="col-md-3 top-twenty">
          <VaccineExpirationPanel key='expire30' title="Expiring in 30 days" expiration={this.state.expiring_vaccinations.exp_30} />
        </div>
        <div className="col-md-3 top-twenty">
          <VaccineExpirationPanel key='expire60' title="Expiring in 60 days" expiration={this.state.expiring_vaccinations.exp_60} />
        </div>
        <div className="col-md-3 top-twenty">
          <VaccineExpirationPanel key='expire90' title="Expiring in 90 days" expiration={this.state.expiring_vaccinations.exp_90} />
        </div>
      </div>
    );
  }
  render(){
    let show = this.state.showVaccines ? this.vaccineRender() : this.certificationRender();

    return(
      <div className="panel pnale-body col-xs-10 col-xs-offset-1 top-twenty">
        <ul className="nav nav-tabs bottom-thirty">
          <li onClick={this.handleCertificationClick} role="presentation" className={!this.state.showVaccines ? 'active' : ''}><a href="#">Certifications</a></li>
          <li onClick={this.handleVaccineClick} role="presentation" className={this.state.showVaccines ? 'active' : ''}><a href="#">Vaccines</a></li>
        </ul>
        {show}
      </div>
    );
  }
}
