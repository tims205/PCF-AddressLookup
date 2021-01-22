import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react"
import * as ReactDOM from "react-dom"
import {AddressLookupControl, IAddressLookupProps} from "./AddressLookup";

export class AddressLookup implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	private _theContainer: HTMLDivElement
	private _context: ComponentFramework.Context<IInputs>;
	private notifyOutputChanged: () => void;

	private _addressName: string = "";
	private _addressLine1: string = "";
	private _addressLine2: string = "";
	private _addressLine3: string = "";
	private _addressCity: string = "";
	private _addressPostcode: string = "";
	private _addressStateOrProvince: string = "";
	private _poBoxNumber: string = "";
	private _addressUPRN: string = "";
	

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._theContainer = container;
		this.notifyOutputChanged = notifyOutputChanged;
	}

	private renderControl(context: ComponentFramework.Context<IInputs>) {

		let props:IAddressLookupProps = {
			apiKey: context.parameters.API_KEY.raw,
			onChange: (item?: any) => {
				if (item.DPA) {
					this._addressName = (item.DPA.ORGANISATION_NAME == null ? "" : item.DPA.ORGANISATION_NAME + ", ")
										+ (item.DPA.DEPARTMENT_NAME == null ? "" : item.DPA.DEPARTMENT_NAME + " ")

					this._addressLine1 = (item.DPA.SUB_BUILDING_NAME == null ? "" : item.DPA.SUB_BUILDING_NAME + " ")
										+ (item.DPA.BUILDING_NAME == null ? "" : item.DPA.BUILDING_NAME + " ") 
										+ (item.DPA.BUILDING_NUMBER == null ? "" : item.DPA.BUILDING_NUMBER + " ") 
										+ (item.DPA.DEPENDENT_THOROUGHFARE_NAME == null ? "" : item.DPA.DEPENDENT_THOROUGHFARE_NAME + " ") 
										+ (item.DPA.THOROUGHFARE_NAME == null ? "" : item.DPA.THOROUGHFARE_NAME);

					this._addressLine2 = item.DPA.DOUBLE_DEPENDENT_LOCALITY == null ? "" : item.DPA.DOUBLE_DEPENDENT_LOCALITY; 
					this._addressLine3 = item.DPA.DEPENDENT_LOCALITY == null ? "" : item.DPA.DEPENDENT_LOCALITY;
					this._addressCity = item.DPA.POST_TOWN == null ? "" : item.DPA.POST_TOWN;
					this._addressPostcode = item.DPA.POSTCODE == null ? "" : item.DPA.POSTCODE;
					this._addressStateOrProvince = item.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION == null ? "" : item.DPA.LOCAL_CUSTODIAN_CODE_DESCRIPTION;
					this._poBoxNumber = item.DPA.PO_BOX_NUMBER == null ? "" : item.DPA.PO_BOX_NUMBER;
					this._addressUPRN = item.DPA.UPRN == null ? "" : item.DPA.UPRN;
					

					this.notifyOutputChanged();
				}
			},
			onCleared: () => {
				this._addressName = "";
				this._addressLine1 = ""
				this._addressLine2 = ""
				this._addressLine3 = ""
				this._addressCity = ""
				this._addressPostcode = ""
				this._addressStateOrProvince = ""
				this._poBoxNumber = ""
				this._addressUPRN = ""

				this.notifyOutputChanged();
			}
		}

		ReactDOM.render(
			React.createElement(
				AddressLookupControl,
				props
			),
			this._theContainer
		);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this.renderControl(context);
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			AddressName: this._addressName,
			AddressLine1: this._addressLine1,
			AddressLine2: this._addressLine2,
			AddressLine3: this._addressLine3,
			AddressCity: this._addressCity,
			PostalCode: this._addressPostcode,
			StateOrProvince: this._addressStateOrProvince,
			POBox: this._poBoxNumber,
			UPRN: this._addressUPRN
			
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._theContainer);
	}
}