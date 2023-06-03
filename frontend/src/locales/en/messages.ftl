reports_title = The reports storage
nick = Nick
title = Title
substances = Substances
date = Date
home-view-ero-description = The ero-like website is actually a platform for creating and sharing reports, similar to tweets, but with the use of digital signatures and structured data. Our platform allows users to easily create reports and share them with others, while ensuring the authenticity and integrity of the data through the use of digital signatures and open standards. As an open source project, we encourage the downloading and sharing of information from our site.
home-view-router-link-text = Look for interesting...
dose = Dose
dose_unit = Dose Unit
time = Time
quality_percent = Quality percent
name_on_pwo = Name on Psychonaut Wiki Org
route_of_admin = Route of administration
author_info = Author Info
background = Background
timeline = Timeline
description = Description
home = Home
reports = Reports
app_submit_report = Submit Report
app_register = Register
app_about = About
app_terms_of_use = Terms of Use Agreement
app_add_translations = Add translations
user_registration = User Registration
public_key_label = Public key (gpg public key block)
public_key_placeholder = 
  -----BEGIN PGP PUBLIC KEY BLOCK-----

  mQINBF//CqwBEADQ622oqnAs9qFAH8sM0rXo+U8BOg95G8/16awsPsOPjdV1kxNs
  •••
    •
    •
    •
  •••
  =O9gO
  -----END PGP PUBLIC KEY BLOCK-----
public_key_warning = ! This information is public! When you upload your public key it's irreversible
how_to_get_keys = How to get keys
how_to_get_keys_details =
  You need to know id of key or user:<br>
  <code>gpg --list-keys</code><br>
  <a href="https://docs.github.com/en/authentication/managing-commit-signature-verification/checking-for-existing-gpg-keys">
  Detailed instructions </a>.
  If you <a
    href="https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key">
  don't have yet keys you can
  <b>create</b></a> them after you have decided which user to use you need to print you public keys and user data:
  <br>
  <code>gpg --armor --export </code>
  <b>$user</b><br>
  For example if your key is <code>DD45FA4DC50F85F1</code>:<br>
  <code>gpg --armor --export DD45FA4DC50F85F1</code>
  <br> For example if your user is "<code>user</code>":<br>
  <code>gpg --armor --export user</code><br>
  After that you have to select all text result, copy, and paste it in the field above. <br>
how_to_set_public_user = How to set public user
how_to_set_public_user_details =
  gpg and ero-like needs username. However we don't need email and there is no verification for a moment. You may add new name for your secret key and hide other names and emails. Edit your user names you can with:
  <br>
  <code>gpg --edit-key </code><b>$user</b><br>
  <a
  href="https://github.com/tomfun/ero-like/blob/ff66d8a21689ae5393a65c0b9e8c990649c7a73b/README-gpg.md#edit-names-and-email">
  more details here </a>. To filter out any user containing @ (email):<br
  ><code>gpg --export-filter keep-uid='uid!~@'
  --armor --export </code><b>$user</b><br>
  <a

  href="https://github.com/tomfun/ero-like/blob/ff66d8a21689ae5393a65c0b9e8c990649c7a73b/README-gpg.md#export-your-key">
  details here </a>.
check_before_sending = 
  ! Before sending information you may see all data you will send:<br/>
  <code>gpg --armor --export DD45FA4DC50F85F1 | gpg --list-packets</code><br/>
signature_label = Signature (gpg clear-sign output)
signature_placeholder = 
  -----BEGIN PGP SIGNED MESSAGE-----
  Hash: SHA256
  
  I read and agree with all terms of use of ero-like and confirm my registration on ero-like
  -----BEGIN PGP SIGNATURE-----
  
  iQIzBAABCgAdFiEEVUcfD9jeufsD1JVP3UX6TcUPhfEFAmC7Q2gACgkQ3UX6TcUP
  •••
    •
    •
    •
  •••
  =B0/L
  -----END PGP SIGNATURE-----
how_to_clear_sign = How do clear sign
how_to_clear_sign_details =
  You need to know public key id or your local user which was used to export public key. Follow for instructions for the another field [gpg public key]<br>
  <code>gpg --list-keys</code><br>
  <a href="https://docs.github.com/en/authentication/managing-commit-signature-verification/checking-for-existing-gpg-keys"> Detailed instructions </a>.
  After you had decided which user to use you need to use it instead of $user:<br>
  <code>echo -e 'I read and agree with all terms of use of ero-like and confirm my registration on ero-like' | gpg --clear-sign --disable-signer-uid --local-user </code><b>$user</b><code> - </code><br>
  After that you have to select all text result, copy, and paste it in the field above.
check_button = Check
submit_button = Submit
user_created = user created!
user_info_message = user: { $nick }<br>
  private key id: { $primaryKeyFingerprint }<br>
signature_made_directly = signature made directly by the main primary private key
sub_key_id = sub key fingerprint: { $usedKeyFingerprint }

ero-like-terms-agreement = <p>Welcome to Ero-Like (ero-like.online). By using our site, you agree to the following terms of
    use:</p>
  <ul>
    <li>User Generated Content: Ero-Like is a platform for user-generated content, which means that
      users are solely responsible for any content they post on the site. We do not endorse or
      guarantee the accuracy, reliability, or quality of any content posted by users.</li>
    <li>No Responsibility for User Content: We are not responsible for any user-generated content on
      the site. We do not monitor or moderate user content, and we do not assume any liability for
      such content.</li>
    <li>License to Use User Content: By posting content on Ero-Like, you grant us a worldwide,
      non-exclusive, royalty-free, transferable license to use, copy, modify, distribute, and
      display such content in connection with the site.</li>
    <li>No Right to Remove or Edit User Content: Once posted, user-generated content cannot be
      removed or edited. Ero-Like does not guarantee the preservation of user-generated content
      and cannot be held responsible for any loss or damage of such content.</li>
    <li>User Privacy: Ero-Like respects the privacy of its users. We will not disclose any personal
      information to third parties without your consent.</li>
    <li>Use of API: By using the Ero-Like API, you agree to comply with the terms of this agreement.
    </li>
    <li>Disclaimer of Warranties: Ero-Like is provided on an "as is" and "as available" basis.
      We do not warrant that the site will be uninterrupted or error-free, and we do not make any
      warranties regarding the accuracy, reliability, or quality of any content on the site.</li>
    <li>Limitation of Liability: Ero-Like shall not be liable for any damages whatsoever, including
      without limitation, direct, indirect, incidental, special, consequential, or punitive damages,
      arising out of or related to the use or inability to use the site.</li>
    <li>User Conduct: Ero-Like encourages respectful and constructive user conduct. Users are
      responsible for their own conduct and for any content they post on the site. Users are
      prohibited from engaging in any activity that violates any law or infringes on any third-party
      rights.</li>
    <li>Acknowledgment of Risks: By using Ero-Like, you acknowledge that you are solely responsible
      for your use of the site and that you assume all risks associated with such use. You agree to
      approach all information with critical thinking and not to blindly trust any authority or
      create any idols for yourself.</li>
    <li>Private Keys: Users are responsible for the safekeeping of their private keys and
      acknowledge that any sharing of their private keys is done at their own risk.</li>
  </ul>
  <p>By using Ero-Like, you agree to these terms and conditions. If you do not agree with any of
    these terms, please do not use the site.</p>
ero-like-about = <q>Explore the eroticism of discovering the truth - it's a journey you won't forget.</q>
  <p>Welcome to Ero-Like (ero-like.online)! At Ero-Like, we believe in the power of machine
    learning and technology to uncover the truth.
    We believe that every <strong>search</strong> and inquiry brings us closer to
    understanding ourselves and the
    world around us.</p>
  <p>Our mission is to help people become more self-aware and discover what works best for them in
    life. We strive to provide valuable insights and tools that can assist individuals in making
    informed decisions about their well-being and personal growth.</p>
  <p>Despite the numerous warnings against the use of psychoactive and narcotic substances, we
    believe that it's better to have access to accurate information about them than to remain in
    ignorance and potentially make harmful choices. We aim to provide unbiased and reliable
    information about various substances and their effects to help individuals make informed
    decisions about their use.</p>
  <p>We also recognize the complexity of the human body and its ecosystem. Therefore, we do not
    condone the use of the human body as a testing ground for any experimental or unproven
    treatments or products.</p>
  <q>"It is a terrible habit to assert that others are thinking wrongly, and that we alone are
    right, and that those who differ from us are our enemies."</q>

  <p><a href="https://gnupg.org/">GnuPG, or GNU Privacy Guard</a>, is a free and open-source
    software program that enables secure communication by providing encryption and digital
    signatures. With GnuPG, you can generate a pair of keys: a private key that you keep secret
    and a public key that you share with others.</p>

  <p>Let's say you are an anonymous user who writes tweets about science fiction books. You want
    to ensure that your tweets are authentic and that no one else can impersonate you. You can use
    GnuPG to create a digital signature for each tweet, which confirms that the tweet is indeed
    from you and has not been tampered with.</p>

  <p>To register on our site, you need to generate your private and public keys using GnuPG.
    Once you have done that, you can create a tweet on our site by making a digital signature
    using your private key. This ensures that your tweet is authentic and cannot be altered
    by anyone else.</p>

  <q>"Journalists are like dogs, when one starts barking, the rest will follow."</q>
  <p>In the real world, it's often not so much about who the person is that you're listening to,
    but rather what they're saying. For example, in the case of a teacher, it may not matter who
    they are as a person, but rather what they're teaching and how effective they are at
    conveying the material to their students. In this sense, it's useful to track what a
    particular teacher is saying and how they're teaching over time, in order to gain insights
    into their approach and effectiveness.</p>
  <p>Similarly, when it comes to data and information, it's important to be able to identify
    reliable sources that consistently provide high-quality data. For example, if we find a data
    source that consistently provides accurate and valuable information, we can mark it as a
    significant source on our website. Others can then use our curated list of significant sources
    to simplify their own search for trustworthy information.</p>

  <q>"If your mother says she loves you, check it out."</q>
  <p>The source of information creates valuable content, which is then noticed and evaluated by
    the user. Other users then benefit from the user's findings and conclusions. To ensure the
    <strong>accuracy and precision of each link</strong> in this chain of information,
    it's crucial to verify <em>the
      source</em> of the data through methods such as <strong>digital signatures</strong>, open
    standards like
    GnuPG RFC4880, and the transparency and accessibility of the information. This process allows
    for more reliable and trustworthy information, benefiting all users in the end.</p>
  <p></p>

  <q>"A gram of one's own experience is worth more than a ton of someone else's advice."</q>
  <p>Machine learning plays a crucial role in analyzing and recommending content to users.
    To enable algorithms to suggest content that is most relevant to each user, it is necessary
    to have structured data that is annotated with tags and descriptions.
    However, for data to be effective in training machines, users must understand what
    they are looking for and what information they need. This may involve selecting specific tags
    or categories that will be used to annotate the content. Only through such annotation and data
    analysis can the best results be achieved in searching and recommending content on the
    ero-like website.</p>
  <p>Ero-Like is a user-generated content platform similar
    to Reddit and Twitter. This means that our users are solely responsible for any content they
    post on the site, and we do not endorse or guarantee the accuracy, reliability, or quality of
    any content posted by users.</p>

  <p>By using Ero-Like, you acknowledge that you are solely responsible for your use of the site
    and that you assume all risks associated with such use. We encourage respectful and
    constructive user conduct and prohibit any activity that violates any law or infringes on
    any third-party rights.</p>

  <p>Please note that any content you post on Ero-Like, including text, images, and multimedia,
    may be copied by other users or accessed through our API. <strong>Once posted, user-generated
      content cannot be removed or edited</strong>,
    and we cannot guarantee the preservation of such content.</p>

  <q>"In the end, the truth will find its way to the surface."</q>

  <p>We respect the privacy of our users and will not disclose any personal information to third
    parties without your consent. However, please note that you are responsible for the
    safekeeping of your private keys, and any sharing of them is done at your own risk.</p>

  Thank you for choosing Ero-Like, where we believe that knowledge is power and that understanding
  ourselves and the world around us is the key to personal growth and well-being.
