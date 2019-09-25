/**
 * Exports the String Utils
 */
module.exports = {
    /**
     * Gets the array index from an patch id
     *
     * @param patches
     * @param id
     * @return {null|number}
     */
    getIndexFromPatchId: (patches, id) => {
        for(let item = 0; item < patches.length; item++) {
            const patch = patches[item];

            if(patch.id === id) {
                return item;
            }
        }

        return null;
    }
};
