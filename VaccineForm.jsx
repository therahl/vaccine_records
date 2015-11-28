class VaccineForm extends React.Component{
  constructor(props){
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
    // this.valid = this.valid.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {errors: ''};
  }
  componentWillMount(){
    let vaccineList = [];
    for(let category of Object.keys(this.props.names)){
      for(let name of this.props.names[category]){
        vaccineList.push({name: name, category: category, administration_date: '', expiration_date: '', service_history_id: this.props.service_history_id});
      }
    }
    this.setState({names: vaccineList, data: vaccineList[0]});
  }
  handleNameChange(e){
    this.setState({data: this.state.names[e.target.value]})
  }

  handleDateChange(date, id){
    let newState = this.state.data;
    newState[id] = date;
    this.setState(newState);
  }
  handleSubmit(e){
    e.preventDefault();
    $.ajax({
      url: `vaccines`,
      method: 'POST',
      dataType: 'JSON',
      data: { vaccine: this.state.data}
    }).success(result => {
      this.props.handleNewVaccine(result.vaccines);
    });
  }
  render(){
    let selectOptions = this.state.names.map((vaccine, index) => {
      return(<option key={vaccine.name} value={index}>{vaccine.name}</option>)
    })
    return(
      <form className="form-horizontal col-md-4" onSubmit={this.handleSubmit}>
        <p className="lead text-center">Add Vaccination</p>
        <div className="form-group">
          <label className="control-label col-sm-4">Name</label>
          <div className="col-sm-8">
            <select className="form-control" name='name' onChange={this.handleNameChange}>
              {selectOptions}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-4">Date Administered</label>
          <div className="col-sm-8">
            <Datepicker value={this.state.data.administration_date} refName="administration_date" onDateChange={this.handleDateChange} />
          </div>
        </div>
        <div className="form-group">
          <label className="control-label col-sm-4">Expiration Date</label>
          <div className="col-sm-8">
            <Datepicker minDate="0" value={this.state.data.expiration_date} refName="expiration_date" onDateChange={this.handleDateChange} />
          </div>
        </div>
        <div className="form-group">
          <div className="col-sm-10 col-sm-offset-2">
            <button className="width-100 button button-sm" type="submit">Add</button>
          </div>
        </div>

      </form>
    );
  }
}
