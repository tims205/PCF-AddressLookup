import * as React from 'react'

const axios = require('axios').default;

import {
    TagPicker,
    IBasePicker,
    ITag,
    IInputProps,
    IBasePickerSuggestionsProps
} from "office-ui-fabric-react/lib/Pickers"

export interface IAddressLookupProps {
    apiKey: string | null,
    onChange: (value?: any) => void
    onCleared: () => void;
}

const pickerProps: IInputProps = {
    onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
    onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
    'aria-label': 'Address picker',
  };

const pickerSuggestionsProps: IBasePickerSuggestionsProps = {
    suggestionsHeaderText: 'Suggested addresses',
    noResultsFoundText: 'No addresses found',
  };


export function AddressLookupControl(myProps: IAddressLookupProps) {
    const picker = React.useRef<IBasePicker<ITag>>(null);
    const [loadedAddresses, setLoadedAddresses] = React.useState([]);
   
     function callApi(filterText?: string, tagList?: ITag[]): Promise<ITag[]> {

        // TEMPORARY API KEY: Ak0r9y6uOdbIgSKgphQ7E6ynWYmZHfEN

        setLoadedAddresses([]);

        return new Promise<ITag[]>(function (resolve,reject) {
            axios.get(`https://api.ordnancesurvey.co.uk/places/v1/addresses/find?query=${filterText}&maxresults=20&key=${myProps.apiKey}`)
            .then(function (response) {
                // Save the loaded addresses so we don't have to query for the details again once a user selects one
                setLoadedAddresses(response.data.results);
                resolve(response.data.results.map(
                    item => ({key:item.DPA.UPRN, name: item.DPA.ADDRESS})
                ));
            })
            .catch(function (error) {
                //TODO

            })
        });
    }
    
    // Find the address that was stored in loadedAddresses and pass it back to the PCF
    const onChange = (items?: ITag[]) => {
        if (items?.length === 1) {
            myProps.onChange(loadedAddresses.filter(
                a => a["DPA"]["UPRN"] === items[0].key
            )[0]);
        } else {
            // Clear all values
            setLoadedAddresses([]);
            myProps.onCleared();
        }
    }    

    return (
        <div>
            <TagPicker
                onResolveSuggestions={callApi}
                pickerCalloutProps={pickerSuggestionsProps}
                itemLimit={1}
                onChange={onChange}
                inputProps={pickerProps}
                resolveDelay={250}
            />
        </div>
    )
}