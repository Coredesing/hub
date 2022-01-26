import Layout from 'components/Layout'

const Disclaimer = () => (
  <Layout title="Disclaimer">
    <div className="px-2 md:px-4 lg:px-16 mx-auto lg:block max-w-4xl pb-4">
      <div className="uppercase font-bold text-4xl">Disclaimer</div>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">No Investment Advice</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">The site cannot and does not contain any investment advice or any other sort of advice. All information on this site is intended for general information only. In no event will GameFi.org be liable for users’ investment decisions of any kind. Accordingly, before taking any action based upon such information, please conduct your own due diligence and consult with the appropriate professionals.</p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">Accuracy of Information</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">All information, videos, and graphic contents on this site have been provided and authorized for use by respective owners. However, GameFi.org does not guarantee the completeness, reliability, and accuracy of this information. Under no circumstance shall GameFi.org have any liability for any loss or damage of any kind incurred due to the use of the content provided on the site.</p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">Consent</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">You hereby consent to our disclaimer and agree to its terms by using our website.</p>

      <div className="uppercase font-bold text-2xl mb-2 mt-8">Update</div>
      <p className="font-casual text-sm leading-6 opacity-80 mb-8">Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
    </div>
  </Layout>
)

export default Disclaimer
